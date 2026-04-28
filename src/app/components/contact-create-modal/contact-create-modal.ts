import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Contact } from '../../models/contact';
import { ContactsService } from '../../services/contacts';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-contact-create-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './contact-create-modal.html',
  styleUrl: './contact-create-modal.scss',
})
export class ContactCreateModal {
  private dialogRef = inject(DialogRef<Contact | null>);
  private contactsService = inject(ContactsService);
  private toastService = inject(ToastService);

  protected saving = signal(false);
  protected errorMessage = signal<string | null>(null);

  name = new FormControl(''.trim(), {
    validators: [
      Validators.required,
      Validators.minLength(3),
      Validators.pattern(/^[a-zA-Zà-žÀ-Ž]{2,} +[a-zA-Zà-žÀ-Ž]{2,}$/),
    ],
    nonNullable: true,
  });

  email = new FormControl('', {
    validators: [
      Validators.required,
      Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}'),
    ],
    nonNullable: true,
  });

  phone = new FormControl('', {
    validators: [Validators.required, Validators.pattern(/^\+?[0-9 ]{10,12}$/)],
    nonNullable: true,
  });

  emailValue!: string;
  phoneValue!: string;
  first_name!: string;
  last_name!: string;

  protected createContact() {
    if (this.errorValidation()) return;

    this.checkInputValues();

    this.saving.set(true);

    this.createNewContact();
  }

  errorValidation(): true | false {
    this.errorMessage.set('');

    // error validation
    if (this.name.invalid || this.email.invalid || this.phone.invalid) {
      this.name.markAsTouched();
      this.email.markAsTouched();
      this.phone.markAsTouched();
      this.errorMessage.set('Please fix the errors');
      return true;
    } else return false;
  }

  checkInputValues() {
    // werte aus inputs extrahieren
    // value = aktueller wert aus input
    const full = this.name.value.trim();
    this.emailValue = this.email.value.trim();
    this.phoneValue = this.phone.value.trim();

    // splitting name
    const space = full.indexOf(' ');
    this.first_name = space === -1 ? full : full.slice(0, space);
    this.last_name = space === -1 ? '' : full.slice(space + 1).trim();
  }

  protected async createNewContact() {
    try {
      const createdContact = await this.contactsService.createContact({
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.emailValue,
        phone: this.phoneValue,
      });

      this.toastService.show('Contact created successfully', 2500);
      this.closeModal(createdContact);
    } catch (error) {
      const message =
        error instanceof Error && error.message ? error.message : 'Could not save contact.';
      this.errorMessage.set(message);
    } finally {
      this.saving.set(false);
    }
  }

  protected closeModal(result: Contact | null = null) {
    this.dialogRef?.close(result);
  }
}
