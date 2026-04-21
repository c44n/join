import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

@Component({
	selector: 'app-contact-create-modal',
	imports: [],
	templateUrl: './contact-create-modal.html',
	styleUrl: './contact-create-modal.scss',
})
export class ContactCreateModal {
	private dialogRef = inject(DialogRef);
	protected closeModal() {
		this.dialogRef?.close();
	}
}
