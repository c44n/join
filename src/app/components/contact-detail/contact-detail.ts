import { Component, inject, input, output } from '@angular/core';
import { Contact } from '../../models/contact';
import { Dialog } from '@angular/cdk/dialog';
import { ContactEditDeleteModal } from '../contact-edit-delete-modal/contact-edit-delete-modal';

@Component({
  selector: 'app-contact-detail',
  imports: [],
  templateUrl: './contact-detail.html',
  styleUrl: './contact-detail.scss',
})
export class ContactDetail {
  contact = input<Contact | null>(null);
  contactChanged = output<'updated' | 'deleted'>();

  editeContact() {
    console.log(this.contact()?.first_name, ' edit !');
  }

  deleteContact() {
    this.openContactEditDeleteModal();
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
}
