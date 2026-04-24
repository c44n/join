import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Contact } from '../../models/contact';
import { ContactsService } from '../../services/contacts';
import { ContactDetail } from '../contact-detail/contact-detail';
import { Dialog } from '@angular/cdk/dialog';
import { ContactCreateModal } from '../contact-create-modal/contact-create-modal';

export interface ContactGroup {
  letter: string;
  contacts: Contact[];
}

@Component({
  selector: 'app-contact-list',
  imports: [ContactDetail],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
 
})
export class ContactList implements OnInit {
  private dialog = inject(Dialog);
  isMobileDetailView = signal(false);

  protected openContactCreateModal() {
    const dialogRef = this.dialog.open<boolean>(ContactCreateModal);
    dialogRef.closed.subscribe(async (wasCreated) => {
      if (!wasCreated) return;
      await this.reloadContacts();
    });
  }

  contacts = signal<Contact[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  selectedContactId = signal<string | null>(null);

  selectedContact = computed<Contact | null>(() => {
    const id = this.selectedContactId();
    if (id == null) return null;
    return this.contacts().find((c) => c.id === id) ?? null;
  });

  selectContact(id: string | number) {
    this.selectedContactId.set(String(id));
  }

  openContactDetails(id: string | number) {
    this.selectContact(id);
    this.isMobileDetailView.set(true);
  }

  backToContactList() {
    this.isMobileDetailView.set(false);
  }

  groupedContacts = computed<ContactGroup[]>(() => {
    const sortedContacts = this.getSortedContacts();
    return this.buildContactGroups(sortedContacts);
  });

  constructor(private contactsService: ContactsService) {}

  async ngOnInit(): Promise<void> {
    try {
      const contacts = await this.contactsService.getContacts();
      this.contacts.set(contacts);
    } catch (error) {
      this.handleLoadError(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  async reloadContacts(changeType?: 'updated' | 'deleted'): Promise<void> {
    const currentSelectedId = this.selectedContactId();
    try {
      const contacts = await this.contactsService.getContacts();
      this.contacts.set(contacts);
      if (changeType === 'deleted') {
        this.selectedContactId.set(null);
        this.isMobileDetailView.set(false);
        return;
      }
      if (!currentSelectedId) return;
      const stillExists = contacts.some((contact) => contact.id === currentSelectedId);
      this.selectedContactId.set(stillExists ? currentSelectedId : null);
    } catch (error) {
      this.handleLoadError(error);
    }
  }

  private getSortedContacts(): Contact[] {
    return [...this.contacts()].sort((a, b) => {
      const firstNameCompare = this.compareNames(a.first_name, b.first_name);
      if (firstNameCompare !== 0) return firstNameCompare;
      return this.compareNames(a.last_name, b.last_name);
    });
  }

  private compareNames(firstValue?: string, secondValue?: string): number {
    return (firstValue ?? '').localeCompare(secondValue ?? '', undefined, {
      sensitivity: 'base',
    });
  }

  private buildContactGroups(contacts: Contact[]): ContactGroup[] {
    const groups = new Map<string, Contact[]>();

    for (const contact of contacts) {
      const letter = this.getGroupLetter(contact);
      const bucket = groups.get(letter) ?? [];
      bucket.push(contact);
      groups.set(letter, bucket);
    }

    return Array.from(groups.entries()).map(([letter, contacts]) => ({
      letter,
      contacts,
    }));
  }

  private getGroupLetter(contact: Contact): string {
    return (contact.first_name?.trim().charAt(0) || '#').toUpperCase();
  }

  private handleLoadError(error: unknown): void {
    this.errorMessage.set('Failed to load contacts. Check console for details.');
    console.error('ContactListComponent load error:', error);
  }
}

