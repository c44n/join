import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormsModule,
  Validators,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { ContactsService } from '../../services/contacts';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-contact-create-modal',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './contact-create-modal.html',
  styleUrl: './contact-create-modal.scss',
})
export class ContactCreateModal {
  private dialogRef = inject(DialogRef);
  private contactsService = inject(ContactsService);
  private toastService = inject(ToastService);
  // protected name = '';
  // protected email = '';
  // protected phone = '';
  protected saving = signal(false);
  protected errorMessage = signal<string | null>(null);

  contactForm = new FormGroup({
    name: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern(/^[a-zA-Zà-žÀ-Ž-]+ +[a-zA-Zà-žÀ-Ž-]+.*$/),
      ],
    }),

    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}'),
      ],
    }),
    phone: new FormControl('', {
      validators: [Validators.required, Validators.pattern('[+ 0-9 ]{11,13}')],
    }),
  });

  protected async createContact() {
    this.errorMessage.set('');

    let first_name;
    let last_name;
    if (this.contactForm.value.name) {
      const full = this.contactForm.value.name.trim();
      const space = full.indexOf(' ');
      first_name = space === -1 ? full : full.slice(0, space);
      last_name = space === -1 ? '' : full.slice(space + 1).trim();
    }

    if (
      !first_name ||
      !last_name ||
      !this.contactForm.value.email?.trim() ||
      !this.contactForm.value.phone
    ) {
      this.errorMessage.set('Name, email and phone are required.');
      return;
    }
    this.saving.set(true);
    try {
      await this.contactsService.createContact({
        first_name,
        last_name,
        email: this.contactForm.value.email,
        phone: this.contactForm.value.phone,
      });
      this.toastService.show('Contact created successfully', 2500);
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

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get phone() {
    return this.contactForm.get('phone');
  }
}
