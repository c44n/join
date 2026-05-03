import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../models/contact';
import { ContactsService } from '../../services/contacts';
import { ToastService } from '../../services/toast';

type Priority = 'Urgent' | 'Medium' | 'Low';
type FormErrors = {
  title: string;
  dueDate: string;
  category: string;
};
type EditableSubtask = {
  id: number;
  title: string;
  isEditing: boolean;
};

@Component({
  selector: 'app-add-task',
  imports: [FormsModule],
  templateUrl: './add-task.html',
  styleUrl: './add-task.scss',
})
export class AddTask implements OnInit {
  private readonly contactsService = inject(ContactsService);
  private readonly toastService = inject(ToastService);

  protected readonly categories = ['Technical Tasks', 'User Story'];
  protected readonly contacts = signal<Contact[]>([]);
  protected readonly errors = signal<FormErrors>(this.emptyErrors());
  protected readonly isAssignedToOpen = signal(false);
  protected readonly priorities: Priority[] = ['Urgent', 'Medium', 'Low'];
  protected readonly selectedContacts = signal<Contact[]>([]);
  protected readonly selectedPriority = signal<Priority>('Medium');
  protected readonly subtasks = signal<EditableSubtask[]>([]);

  protected category = '';
  protected description = '';
  protected dueDate = '';
  protected subtaskInput = '';
  protected title = '';
  private nextSubtaskId = 1;
  private attemptedSubmit = false;

  async ngOnInit(): Promise<void> {
    await this.loadContacts();
  }

  @HostListener('document:click')
  protected closeAssignedTo(): void {
    this.isAssignedToOpen.set(false);
  }

  protected clearForm(): void {
    this.attemptedSubmit = false;
    this.category = '';
    this.description = '';
    this.dueDate = '';
    this.subtaskInput = '';
    this.title = '';
    this.errors.set(this.emptyErrors());
    this.selectedContacts.set([]);
    this.selectedPriority.set('Medium');
    this.subtasks.set([]);
  }

  protected createTask(): void {
    this.attemptedSubmit = true;
    this.errors.set(this.validateForm());
    if (this.hasErrors()) {
      this.toastService.show('Please check the required fields.');
      return;
    }
    this.toastService.show('Task created successfully.');
    this.clearForm();
  }

  protected deleteSubtask(id: number): void {
    this.subtasks.update((subtasks) => subtasks.filter((subtask) => subtask.id !== id));
  }

  protected formatAssignedTo(): string {
    return this.selectedContacts().map(this.fullName).join(', ') || 'Select contacts to assign';
  }

  protected handleSubtaskEnter(event: Event): void {
    event.preventDefault();
    this.addSubtask();
  }

  protected inputClass(field: keyof FormErrors): boolean {
    return Boolean(this.errors()[field]);
  }

  protected isSelected(contactId: string): boolean {
    return this.selectedContacts().some((contact) => contact.id === contactId);
  }

  protected onBlurField(field: keyof FormErrors): void {
    if (!this.attemptedSubmit) {
      return;
    }
    this.setError(field, this.validateField(field));
  }

  protected resetSubtaskInput(event?: Event): void {
    event?.stopPropagation();
    this.subtaskInput = '';
  }

  protected saveEditedSubtask(id: number, event?: Event): void {
    event?.stopPropagation();
    this.subtasks.update((subtasks) =>
      subtasks
        .map((subtask) => this.saveSubtask(subtask, id))
        .filter((subtask) => subtask.title.length > 0),
    );
  }

  protected setPriority(priority: Priority): void {
    this.selectedPriority.set(priority);
  }

  protected startEditingSubtask(id: number): void {
    this.subtasks.update((subtasks) =>
      subtasks.map((subtask) => ({
        ...subtask,
        isEditing: subtask.id === id,
      })),
    );
  }

  protected stopDropdownClick(event: Event): void {
    event.stopPropagation();
  }

  protected toggleAssignedTo(event: Event): void {
    event.stopPropagation();
    this.isAssignedToOpen.update((isOpen) => !isOpen);
  }

  protected toggleContact(contact: Contact): void {
    this.selectedContacts.update((selected) =>
      this.isSelected(contact.id)
        ? selected.filter(({ id }) => id !== contact.id)
        : [...selected, contact],
    );
  }

  protected updateSubtaskTitle(id: number, title: string): void {
    this.subtasks.update((subtasks) =>
      subtasks.map((subtask) => (subtask.id === id ? { ...subtask, title } : subtask)),
    );
  }

  private addSubtask(): void {
    const title = this.subtaskInput.trim();
    if (!title) {
      return;
    }
    this.subtasks.update((subtasks) => [...subtasks, this.createSubtask(title)]);
    this.subtaskInput = '';
  }

  private createSubtask(title: string): EditableSubtask {
    return {
      id: this.nextSubtaskId++,
      title,
      isEditing: false,
    };
  }

  private emptyErrors(): FormErrors {
    return {
      title: '',
      dueDate: '',
      category: '',
    };
  }

  private fullName(contact: Contact): string {
    return `${contact.first_name} ${contact.last_name}`;
  }

  private hasErrors(): boolean {
    return Object.values(this.errors()).some(Boolean);
  }

  protected initials(contact: Contact): string {
    return `${contact.first_name[0] ?? ''}${contact.last_name[0] ?? ''}`.toUpperCase();
  }

  private async loadContacts(): Promise<void> {
    try {
      this.contacts.set(await this.contactsService.getContacts());
    } catch {
      this.toastService.show('Contacts could not be loaded.');
    }
  }

  private saveSubtask(subtask: EditableSubtask, id: number): EditableSubtask {
    if (subtask.id !== id) {
      return subtask;
    }
    return {
      ...subtask,
      title: subtask.title.trim(),
      isEditing: false,
    };
  }

  private setError(field: keyof FormErrors, value: string): void {
    this.errors.update((errors) => ({
      ...errors,
      [field]: value,
    }));
  }

  protected todayIso(): string {
    return new Date().toISOString().split('T')[0];
  }

  private validateCategory(): string {
    return this.category ? '' : 'Please select a task category.';
  }

  private validateDueDate(): string {
    if (!this.dueDate) {
      return 'Please choose a due date.';
    }
    return this.dueDate < this.todayIso() ? 'Due date cannot be in the past.' : '';
  }

  private validateField(field: keyof FormErrors): string {
    if (field === 'title') {
      return this.validateTitle();
    }
    if (field === 'dueDate') {
      return this.validateDueDate();
    }
    return this.validateCategory();
  }

  private validateForm(): FormErrors {
    return {
      title: this.validateTitle(),
      dueDate: this.validateDueDate(),
      category: this.validateCategory(),
    };
  }

  private validateTitle(): string {
    return this.title.trim() ? '' : 'Please enter a title.';
  }
}
