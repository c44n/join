import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { Component, Input } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BoardTask } from '../../models/task';
import { Contact } from '../../models/contact';

@Component({
  selector: 'app-task',
  imports: [MatProgressBarModule, CdkMenuTrigger, CdkMenu, CdkMenuItem],
  templateUrl: './task.html',
  styleUrl: './task.scss',
})
export class Task {
  @Input({ required: true }) task!: BoardTask;

  protected readonly maxAssigneeAvatars = 3;

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
      return 'assets/icons/arrow-upward.png';
    }

    if (this.task.priority === 'low') {
      return 'assets/icons/arrow-downward.png';
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

  protected taskCategoryLabel(): string {
    return this.task.category === 'user_story' ? 'User Story' : 'Technical Task';
  }

  protected visibleAssignees(): Contact[] {
    return this.task.assignees.slice(0, this.maxAssigneeAvatars);
  }
}
