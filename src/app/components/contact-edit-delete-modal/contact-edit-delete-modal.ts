import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../models/contact';
import { ContactsService } from '../../services/contacts';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-contact-edit-delete-modal',
  imports: [FormsModule],
  templateUrl: './contact-edit-delete-modal.html',
  styleUrl: './contact-edit-delete-modal.scss',
})
export class ContactEditDeleteModal {
  private dialogRef = inject(DialogRef);
  private contactsService = inject(ContactsService);
  private toastService = inject(ToastService);
  private data = inject<Contact>(DIALOG_DATA);
  protected name = `${this.data.first_name} ${this.data.last_name}`.trim();
  protected email = this.data.email;
  protected phone = this.data.phone;
  protected saving = signal(false);
  protected errorMessage = signal<string | null>(null);

  protected get avatarLabel(): string {
    return `${this.data.first_name?.[0] ?? ''}${this.data.last_name?.[0] ?? ''}`.toUpperCase();
  }

  protected get avatarColor(): string {
    return this.data.color || '#29abe2';
  }

  protected async saveContact() {
    this.errorMessage.set(null);
    const full = this.name.trim();
    const space = full.indexOf(' ');
    const first_name = space === -1 ? full : full.slice(0, space);
    const last_name = space === -1 ? '' : full.slice(space + 1).trim();

    if (!first_name || !this.email.trim()) {
      this.errorMessage.set('Name and email are required.');
      return;
    }

    this.saving.set(true);
    try {
      await this.contactsService.updateContact(this.data.id, {
        first_name,
        last_name,
        email: this.email,
        phone: this.phone,
        color: this.data.color,
      });
      this.toastService.show('Contact successfully updated', 2500);
      this.closeModal('updated');
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : 'Could not update contact.';
      this.errorMessage.set(message);
    } finally {
      this.saving.set(false);
    }
  }

  protected async removeContact() {
    this.errorMessage.set(null);
    this.saving.set(true);
    try {
      await this.contactsService.deleteContact(this.data.id);
      this.toastService.show('Contact successfully deleted', 2500);
      this.closeModal('deleted');
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : 'Could not delete contact.';
      this.errorMessage.set(message);
    } finally {
      this.saving.set(false);
    }
  }

  protected closeModal(result: 'updated' | 'deleted' | null = null) {
    this.dialogRef?.close(result);
  }
}
