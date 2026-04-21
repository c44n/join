import { Component, input } from '@angular/core';
import { Contact } from '../../models/contact';

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
}
