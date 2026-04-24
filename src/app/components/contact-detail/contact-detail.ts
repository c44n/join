import { Component, inject, input, output } from '@angular/core';
import { Contact } from '../../models/contact';
import { Dialog } from '@angular/cdk/dialog';
import { ContactEditDeleteModal } from '../contact-edit-delete-modal/contact-edit-delete-modal';
import { ContactsService } from '../../services/contacts';
import { ToastService } from '../../services/toast';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';

@Component({
	selector: 'app-contact-detail',
	imports: [CdkMenu, CdkMenuItem, CdkMenuTrigger],
	templateUrl: './contact-detail.html',
	styleUrl: './contact-detail.scss',
})
export class ContactDetail {
	contact = input<Contact | null>(null);
	contactChanged = output<'updated' | 'deleted'>();
	backRequested = output<void>();
	private contactsService = inject(ContactsService);
	private toastService = inject(ToastService);

	editeContact() {
		console.log(this.contact()?.first_name, ' edit !');
	}

	async deleteContact() {
		const currentContact = this.contact();
		if (!currentContact) return;
		try {
			await this.contactsService.deleteContact(currentContact.id);
			this.toastService.show('Contact successfully deleted', 2500);
			this.contactChanged.emit('deleted');
		} catch (error) {
			const message =
				error instanceof Error && error.message ? error.message : 'Could not delete contact.';
			this.toastService.show(message, 2500);
		}
	}

	private dialog = inject(Dialog);

	protected openContactEditDeleteModal() {
		const currentContact = this.contact();
		if (!currentContact) return;
		const dialogRef = this.dialog.open<'updated' | 'deleted' | null>(ContactEditDeleteModal, {
			data: currentContact,
		});
		dialogRef.closed.subscribe((result) => {
			if (result === 'updated' || result === 'deleted') {
				this.contactChanged.emit(result);
			}
		});
	}

	backToList() {
		this.backRequested.emit();
	}
}
