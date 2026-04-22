import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Contact } from '../../models/contact';
import { ContactsService } from '../../services/contacts';
import { ToastService } from '../../services/toast';
import { minLength } from '@angular/forms/signals';

@Component({
    selector: 'app-contact-edit-delete-modal',
    imports: [ReactiveFormsModule],
    templateUrl: './contact-edit-delete-modal.html',
    styleUrl: './contact-edit-delete-modal.scss',
})
export class ContactEditDeleteModal {
    private dialogRef = inject(DialogRef);
    private contactsService = inject(ContactsService);
    private toastService = inject(ToastService);
    private data = inject<Contact>(DIALOG_DATA);

    name = new FormControl(`${this.data.first_name} ${this.data.last_name}`.trim(), {
        validators: [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Zà-žÀ-Ž-]+ +[a-zA-Zà-žÀ-Ž-]+.*$/)],
        nonNullable: true
    });

    email = new FormControl(this.data.email, {
        validators: [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')],
        nonNullable: true
    })

    phone = new FormControl(this.data.phone, {
        validators: [Validators.required, Validators.pattern("[+ 0-9 ]{11,13}")],
        nonNullable: true
    })

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

        // error validation
        if (this.name.invalid || this.email.invalid || this.phone.invalid) {
            this.name.markAsTouched();
            this.email.markAsTouched();
            this.phone.markAsTouched();
            this.errorMessage.set('Please fix the errors');
            return;
        }

        // werte aus inputs extrahieren
        // value = aktueller wert aus input
        const full = this.name.value.trim();
        const emailValue = this.email.value.trim();
        const phoneValue = this.phone.value.trim();
        
        // splitting name
        const space = full.indexOf(' ');
        const first_name = space === -1 ? full : full.slice(0, space);
        const last_name = space === -1 ? '' : full.slice(space + 1).trim();

        this.saving.set(true);

        try {
            await this.contactsService.updateContact(this.data.id, {
                first_name,
                last_name,
                email: emailValue,
                phone: phoneValue,
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
