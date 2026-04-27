import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { Component, inject, signal } from '@angular/core';
import {FormControl,Validators,ReactiveFormsModule,} from '@angular/forms';
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
	private dialogRef = inject(DialogRef);
	private contactsService = inject(ContactsService);
	private toastService = inject(ToastService);

	protected saving = signal(false);
	protected errorMessage = signal<string | null>(null);

	name = new FormControl(''.trim(), {
		validators: [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Zà-žÀ-Ž]{2,} +[a-zA-Zà-žÀ-Ž]{2,}$/)],
		nonNullable: true
	});

	email = new FormControl('', {
		validators: [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')],
		nonNullable: true
	})

	phone = new FormControl('', {
		validators: [Validators.required, Validators.pattern(/^\+?[0-9 ]{10,12}$/)],
		nonNullable: true
	})

	protected async createContact() {
		this.errorMessage.set('');

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
			await this.contactsService.createContact({
				first_name,
                last_name,
                email: emailValue,
                phone: phoneValue,
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
}
