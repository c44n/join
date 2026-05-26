import { DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Contact } from '../../models/contact';
import { Task, TaskStatus } from '../../models/task';
import { AuthService } from '../../services/auth';
import { ContactsService } from '../../services/contacts';
import { SupabaseService } from '../../services/supabase';
import { TasksService } from '../../services/tasks';

@Component({
  selector: 'app-summary',
  imports: [DatePipe],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})
export class Summary implements OnInit {
  private readonly tasksService = inject(TasksService);
  private readonly contactsService = inject(ContactsService);
  private readonly authService = inject(AuthService);
  private readonly supabaseService = inject(SupabaseService);

  protected readonly tasks = signal<Task[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly displayName = signal('');
  protected readonly isGuestUser = signal(false);

  protected readonly greeting = computed(() => this.getGreeting());
  protected readonly todoCount = computed(() => this.countByStatus('todo'));
  protected readonly inProgressCount = computed(() => this.countByStatus('in_progress'));
  protected readonly awaitingFeedbackCount = computed(() => this.countByStatus('awaiting_feedback'));
  protected readonly doneCount = computed(() => this.countByStatus('done'));
  protected readonly tasksInBoardCount = computed(
    () => this.tasks().filter((task) => task.status !== 'done').length,
  );
  protected readonly hasOpenTasks = computed(() => this.tasksInBoardCount() > 0);
  protected readonly upcomingDeadline = computed(() => this.findUpcomingDeadline());
  protected readonly upcomingDeadlineCount = computed(() => this.countTasksForUpcomingDeadline());

  async ngOnInit(): Promise<void> {
    this.isLoading.set(true);

    try {
      await Promise.all([this.loadTasks(), this.loadDisplayName()]);
    } finally {
      this.isLoading.set(false);
    }
  }

  private async loadTasks(): Promise<void> {
    try {
      this.tasks.set(await this.tasksService.getTasks());
    } catch {
      this.tasks.set([]);
    }
  }

  private async loadDisplayName(): Promise<void> {
    try {
      if (this.authService.isGuestSignIn()) {
        this.isGuestUser.set(true);
        this.displayName.set('');
        return;
      }

      this.isGuestUser.set(false);

      const { data } = await this.supabaseService.supabase.auth.getUser();
      const email = data.user?.email?.trim().toLowerCase();

      if (!email) {
        return;
      }

      this.displayName.set(this.formatEmailAlias(email));

      const contacts = await this.contactsService.getContacts();
      const contact = contacts.find((entry) => entry.email.trim().toLowerCase() === email);

      if (contact) {
        this.displayName.set(this.formatFullName(contact));
      }
    } catch {
      this.isGuestUser.set(false);
      return;
    }
  }

  private countByStatus(status: TaskStatus): number {
    return this.tasks().filter((task) => task.status === status).length;
  }

  private findUpcomingDeadline(): Task | null {
    const upcomingTasks = this.tasks().filter((task) => task.status !== 'done');

    if (!upcomingTasks.length) {
      return null;
    }

    return [...upcomingTasks].sort((left, right) => this.compareDueDates(left, right))[0] ?? null;
  }

  private compareDueDates(left: Task, right: Task): number {
    return new Date(left.due_date).getTime() - new Date(right.due_date).getTime();
  }

  private countTasksForUpcomingDeadline(): number {
    const deadline = this.upcomingDeadline();

    if (!deadline) {
      return 0;
    }

    return this.tasks().filter(
      (task) => task.status !== 'done' && this.isSameDay(task.due_date, deadline.due_date),
    ).length;
  }

  private isSameDay(leftDate: string, rightDate: string): boolean {
    return new Date(leftDate).toDateString() === new Date(rightDate).toDateString();
  }

  private getGreeting(): string {
    const hour = new Date().getHours();

    if (hour < 12) {
      return 'Good morning';
    }

    if (hour < 18) {
      return 'Good afternoon';
    }

    return 'Good evening';
  }

  private formatFullName(contact: Contact): string {
    return `${contact.first_name} ${contact.last_name}`.trim();
  }

  private formatEmailAlias(email: string): string {
    const alias = email.split('@')[0] ?? 'Guest User';
    const normalizedAlias = alias.trim() || 'Guest User';

    return normalizedAlias
      .replace(/[._-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0].toUpperCase() + part.slice(1))
      .join(' ');
  }
}
