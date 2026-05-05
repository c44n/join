import { Component, inject } from '@angular/core';
import { DialogRef } from '@angular/cdk/dialog';
import { BoardTask } from '../../models/task';
import { TitleCasePipe, DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-task-details-modal',
  standalone: true,
  imports: [TitleCasePipe, DatePipe, NgFor, NgIf],
  templateUrl: './task-details-modal.html',
  styleUrl: './task-details-modal.scss',
})
export class TaskDetailsModal {
  task!: BoardTask;

  private dialogRef = inject(DialogRef);

  closeModal() {
    this.dialogRef.close();
  }

  deleteTask() {
    this.dialogRef.close('deleted');
  }

  editTask() {}

  priorityIcon(): string {
    if (this.task.priority === 'urgent') return 'assets/icons/arrow-upward.png';
    if (this.task.priority === 'low') return 'assets/icons/arrow-downward.png';
    return 'assets/icons/priority-medium.png';
  }
}
