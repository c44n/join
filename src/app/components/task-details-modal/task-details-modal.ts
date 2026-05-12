import { Component, inject, signal, OnInit } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { TaskCategory, TaskDetails, TaskPriority, TaskStatus } from '../../models/task';
import { TitleCasePipe, DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TasksService } from '../../services/tasks';
import { Contact } from '../../models/contact';
import { ContactsService } from '../../services/contacts';
import { Task } from '../task/task';
import { Subtask } from '../../models/subtask';
import { SubtasksService } from '../../services/subtasks';

@Component({
  selector: 'app-task-details-modal',
  standalone: true,
  imports: [TitleCasePipe, DatePipe, ReactiveFormsModule],
  templateUrl: './task-details-modal.html',
  styleUrl: './task-details-modal.scss',
})
export class TaskDetailsModal implements OnInit {
  tasksService = inject(TasksService);
  contactsService = inject(ContactsService);
  subtasksService = inject(SubtasksService);

  private dialogRef = inject(DialogRef);

  data = inject<{ taskDetails: TaskDetails; asignedContacts: Contact[] }>(DIALOG_DATA);
  task: TaskDetails = this.data.taskDetails;

  openEdit = signal(false);
  assignedContacts = signal<Contact[] | []>(this.data.asignedContacts);
  contacts = signal<Contact[] | []>([]);

  contactList: boolean = false;

  subtasks = signal<Subtask[]>([]);
  newSubtask = new FormControl('');

  async saveNewSubtask(title:string) { 
    const newSubtask: Subtask[] = await this.subtasksService.insertSubtask(this.task.id, title);

    this.subtasks.update((subtasks) => newSubtask.concat(subtasks));
    this.newSubtask.setValue('');
  }

  async ngOnInit(): Promise<void> {
    this.contacts.set(await this.getContacts());
    this.subtasks.set(this.task.subtasks);

    console.log(this.subtasks());
  }

  private getContacts(): Promise<Contact[] | []> {
    return this.contactsService.getContacts();
  }

  isContactSelected(contact_id: string) {
    return this.assignedContacts().find((contact) => contact.id == contact_id);
  }

  toggleContactAssignee(contact: Contact) {
    this.assignedContacts.update((contacts) =>
      this.assignedContacts().find((cont) => cont.id == contact.id)
        ? contacts.filter(({ id }) => id !== contact.id)
        : [...contacts, contact],
    );
  }

  editForm = new FormGroup({
    title: new FormControl(this.task.title, { validators: [Validators.required] }),
    description: new FormControl(this.task.description),
    due_date: new FormControl(this.task.due_date),
  });

  toggleContactList() {
    if (this.contactList) this.contactList = false;
    else this.contactList = true;
  }

  changePriority(priority: TaskPriority) {
    this.task.priority = priority;
  }

  todayIso(): string {
    return new Date().toISOString().split('T')[0];
  }

  protected async updateTask() {
    let title: string | undefined;
    let description: string | undefined;
    let dueDate: string | undefined;

    if (this.editForm.value.title) title = this.editForm.value.title;
    if (this.editForm.value.description) description = this.editForm.value.description;
    if (this.editForm.value.due_date) dueDate = this.editForm.value.due_date;

    this.task = await this.tasksService.updateTask(this.task.id, {
      title,
      description,
      dueDate,
      priority: this.task.priority,
      category: this.task.category,
      status: this.task.status,
      assigneeIds: this.getAssignedIds(),
      subtasks: this.task.subtasks,
    });

    this.openEdit.set(false);
  }

  getAssignedIds() {
    return this.assignedContacts().map((contact) => contact.id);
  }

  closeModal() {
    this.dialogRef.close();
  }

  deleteTask() {
    this.dialogRef.close('deleted');
  }

  editTask() {
    this.openEdit.set(true);
  }

  priorityIcon(): string {
    if (this.task.priority === 'urgent') return 'assets/icons/priority-urgent.png';
    if (this.task.priority === 'low') return 'assets/icons/priority-low.png';
    return 'assets/icons/priority-medium.png';
  }
}
