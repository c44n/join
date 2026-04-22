import { DialogRef } from '@angular/cdk/dialog';
import { Component, inject } from '@angular/core';

@Component({
  selector: 'app-contact-edit-delete-modal',
  imports: [],
  templateUrl: './contact-edit-delete-modal.html',
  styleUrl: './contact-edit-delete-modal.scss',
})
export class ContactEditDeleteModal {
  private dialogRef = inject(DialogRef)
	protected closeModal() {
		this.dialogRef?.close();
	}
}
