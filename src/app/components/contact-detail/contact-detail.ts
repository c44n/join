import { Component, inject, input } from '@angular/core';
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

  editeContact() {
    console.log(this.contact()?.first_name, ' edit !');
  }

  deleteContact() {
    console.log(this.contact()?.first_name, ' deleted !');
  }

  private dialog = inject(Dialog);

  protected openContactEditDeleteModal() {
    this.dialog.open(ContactEditDeleteModal);
  }
}
