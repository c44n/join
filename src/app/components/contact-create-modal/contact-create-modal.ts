import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ContactsService } from '../../services/contacts';

@Component({
  selector: 'app-contact-create-modal',
  imports: [FormsModule],
  templateUrl: './contact-create-modal.html',
  styleUrl: './contact-create-modal.scss',
})
export class ContactCreateModal {
  private dialogRef = inject(DialogRef);
  private contactsService = inject(ContactsService);
  protected name = '';
  protected email = '';
  protected phone = '';
  protected saving = signal(false);
  protected errorMessage = signal<string | null>(null);

  protected async createContact() {
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
      await this.contactsService.createContact({
        first_name,
        last_name,
        email: this.email,
        phone: this.phone,
      });
      this.closeModal(true);
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : 'Could not save contact.';
      this.errorMessage.set(message);
    } finally {
      this.saving.set(false);
    }
  }

  protected closeModal(result: boolean = false) {
    this.dialogRef?.close(result);
  }
}
