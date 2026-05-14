import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { Component, Input, Output, EventEmitter, inject, output } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BoardTask, TaskDetails, TaskStatus } from '../../models/task';
import { Contact } from '../../models/contact';
import { TasksService } from '../../services/tasks';
import { Dialog } from '@angular/cdk/dialog';
import { TaskDetailsModal } from '../task-details-modal/task-details-modal';

@Component({
  selector: 'app-task',
  imports: [MatProgressBarModule, CdkMenuTrigger, CdkMenu, CdkMenuItem],
  templateUrl: './task.html',
  styleUrl: './task.scss',
})
export class Task {
  @Input({ required: true }) task!: BoardTask;
  @Input() isMoving = false;
  @Output() statusChange = new EventEmitter<TaskStatus>();

  @Output() taskChange = new EventEmitter<string|null>();

  protected readonly maxAssigneeAvatars = 3;
  protected readonly moveTargets: TaskStatus[] = [
    'todo',
    'in_progress',
    'awaiting_feedback',
    'done',
  ];

  dialog = inject(Dialog);
  tasksService = inject(TasksService);

  taskDetails!: TaskDetails;

  async ngOnInit(): Promise<void> {
    // for task Edit we need task in modal TaskDetails
    await this.getTaskDetails();
  }

  protected async getTaskDetails() {
    this.taskDetails = await this.tasksService.getTaskById(this.task.id);
  }

  protected openDetailDialog():void {
    const dialogRef = this.dialog.open<TaskDetailsModal>(TaskDetailsModal, {
      hasBackdrop: true,
      backdropClass: 'contact-dialog-backdrop',
      data: { taskDetails: this.taskDetails, asignedContacts: this.task.assignees },
      disableClose: true,
    });

    dialogRef.closed.subscribe(() => {
      this.taskChange.emit();
    });
  }

  protected completedSubtasks(): number {
    return this.task.subtasks.filter((subtask) => subtask.completed).length;
  }

  protected extraAssigneeCount(): number {
    return Math.max(0, this.task.assignees.length - this.maxAssigneeAvatars);
  }

  protected initials(contact: Contact): string {
    return `${contact.first_name[0] ?? ''}${contact.last_name[0] ?? ''}`.toUpperCase();
  }

  protected priorityIcon(): string {
    if (this.task.priority === 'urgent') {
      return 'assets/icons/priority-urgent.png';
    }

    if (this.task.priority === 'low') {
      return 'assets/icons/priority-low.png';
    }

    return 'assets/icons/priority-medium.png';
  }

  protected priorityLabel(): string {
    if (this.task.priority === 'urgent') {
      return 'priority-urgent';
    }

    if (this.task.priority === 'low') {
      return 'priority-low';
    }

    return 'priority-medium';
  }

  protected progressValue(): number {
    if (!this.task.subtasks.length) {
      return 0;
    }

    return (this.completedSubtasks() / this.task.subtasks.length) * 100;
  }

  protected showSubtaskProgress(): boolean {
    return this.task.subtasks.length > 0;
  }

  protected moveTask(status: TaskStatus): void {
    if (status === this.task.status || this.isMoving) {
      return;
    }

    this.statusChange.emit(status);
  }

  protected moveTargetLabel(status: TaskStatus): string {
    if (status === 'todo') {
      return 'To do';
    }

    if (status === 'in_progress') {
      return 'In progress';
    }

    if (status === 'awaiting_feedback') {
      return 'Await feedback';
    }

    return 'Done';
  }

  protected showMoveTarget(status: TaskStatus): boolean {
    return status !== this.task.status;
  }

  protected taskCategoryLabel(): string {
    return this.task.category === 'user_story' ? 'User Story' : 'Technical Task';
  }

  protected visibleAssignees(): Contact[] {
    return this.task.assignees.slice(0, this.maxAssigneeAvatars);
  }
}
