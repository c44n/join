import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BoardTask, TaskStatus } from '../../models/task';
import { TasksService } from '../../services/tasks';
import { ToastService } from '../../services/toast';
import { Task } from '../task/task';
import { Dialog } from '@angular/cdk/dialog';
import { TaskDetailsModal } from '../task-details-modal/task-details-modal';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem, CdkDropListGroup } from '@angular/cdk/drag-drop';


@Component({
    selector: 'app-board',
    imports: [RouterLink, Task, CdkDropList, CdkDrag, CdkDropListGroup],
    templateUrl: './board.html',
    styleUrl: './board.scss',
})
export class Board implements OnInit {
    private readonly tasksService = inject(TasksService);
    private readonly toastService = inject(ToastService);
    private readonly dialog = inject(Dialog);

    protected readonly tasks = signal<BoardTask[]>([]);
    protected readonly isLoading = signal(false);
    protected readonly movingTaskIds = signal<string[]>([]);
    protected readonly searchTerm = signal('');

    protected readonly todoTasks = computed(() => this.tasksByStatus('todo'));
    protected readonly inProgressTasks = computed(() => this.tasksByStatus('in_progress'));
    protected readonly awaitingFeedbackTasks = computed(() =>
        this.tasksByStatus('awaiting_feedback'),
    );
    protected readonly doneTasks = computed(() => this.tasksByStatus('done'));

    async ngOnInit(): Promise<void> {
        await this.loadTasks();
    }

    protected onSearch(term: string): void {
        this.searchTerm.set(term.trim().toLowerCase());
    }

    protected openTaskDetails(task: BoardTask) {
        const ref = this.dialog.open<TaskDetailsModal>(TaskDetailsModal, {
            hasBackdrop: true,
            backdropClass: 'contact-dialog-backdrop',
        }) as any;

        (ref.componentInstance as TaskDetailsModal).task = task;

        ref.closed.subscribe(async (result: string) => {
            if (result === 'deleted') {
                await this.deleteTask(task.id);
            }
        });
    }

    protected isMovingTask(taskId: string): boolean {
        return this.movingTaskIds().includes(taskId);
    }

    protected async onTaskDropped(event: CdkDragDrop<BoardTask[]>) {
        console.log(event.previousContainer.data);

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }

        const task = event.item.data as BoardTask;
        const newStatus = event.container.id as TaskStatus;

        if (!task || !newStatus || event.previousContainer.id === newStatus) {
            console.warn('Drop abgebrochen: Task oder Status ungültig oder identisch.');
            return;
        }

        await this.moveTask(task.id, newStatus);
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
            this.tasks.update((tasks) => tasks.map((task) => (task.id === taskId ? previousTask : task)));
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

    private async deleteTask(taskId: string): Promise<void> {
        try {
            await this.tasksService.deleteTask(taskId);

            this.tasks.update((tasks) => tasks.filter((t) => t.id !== taskId));

            this.toastService.show('Task deleted successfully.');
        } catch {
            this.toastService.show('Task could not be deleted.');
        }
    }
}
