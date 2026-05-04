import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BoardTask, TaskStatus } from '../../models/task';
import { TasksService } from '../../services/tasks';
import { ToastService } from '../../services/toast';
import { Task } from '../task/task';

@Component({
  selector: 'app-board',
  imports: [RouterLink, Task],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board implements OnInit {
  private readonly tasksService = inject(TasksService);
  private readonly toastService = inject(ToastService);

  protected readonly tasks = signal<BoardTask[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly movingTaskIds = signal<string[]>([]);
  protected readonly searchTerm = signal('');

  protected readonly todoTasks = computed(() => this.tasksByStatus('todo'));
  protected readonly inProgressTasks = computed(() => this.tasksByStatus('in_progress'));
  protected readonly awaitingFeedbackTasks = computed(() => this.tasksByStatus('awaiting_feedback'));
  protected readonly doneTasks = computed(() => this.tasksByStatus('done'));

  async ngOnInit(): Promise<void> {
    await this.loadTasks();
  }

  protected onSearch(term: string): void {
    this.searchTerm.set(term.trim().toLowerCase());
  }

  protected isMovingTask(taskId: string): boolean {
    return this.movingTaskIds().includes(taskId);
  }

  protected async moveTask(taskId: string, status: TaskStatus): Promise<void> {
    const previousTask = this.tasks().find((task) => task.id === taskId);

    if (!previousTask || previousTask.status === status || this.isMovingTask(taskId)) {
      return;
    }

    this.movingTaskIds.update((ids) => [...ids, taskId]);
    this.tasks.update((tasks) =>
      tasks.map((task) => (task.id === taskId ? { ...task, status } : task)),
    );

    try {
      await this.tasksService.updateTask(taskId, { status });
      this.toastService.show('Task moved successfully.');
    } catch {
      this.tasks.update((tasks) =>
        tasks.map((task) => (task.id === taskId ? previousTask : task)),
      );
      this.toastService.show('Task could not be moved.');
    } finally {
      this.movingTaskIds.update((ids) => ids.filter((id) => id !== taskId));
    }
  }

  private async loadTasks(): Promise<void> {
    this.isLoading.set(true);

    try {
      this.tasks.set(await this.tasksService.getBoardTasks());
    } catch {
      this.toastService.show('Tasks could not be loaded.');
    } finally {
      this.isLoading.set(false);
    }
  }

  private matchesSearch(task: BoardTask): boolean {
    const term = this.searchTerm();

    if (!term) {
      return true;
    }

    const title = task.title.toLowerCase();
    const description = (task.description ?? '').toLowerCase();
    return title.includes(term) || description.includes(term);
  }

  private tasksByStatus(status: TaskStatus): BoardTask[] {
    return this.tasks().filter((task) => task.status === status && this.matchesSearch(task));
  }
}
