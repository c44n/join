import { Component, OnInit, signal } from '@angular/core';
import { Contact } from '../../models/contact';

export interface ContactGroup {
  letter: string;
  contacts: Contact[];
}

@Component({
  selector: 'app-contact-list',
  imports: [],
  templateUrl: './contact-list.html',
  styleUrl: './contact-list.scss',
})
export class ContactList implements OnInit {
  contacts = signal<Contact[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  selectedContactId: string | number | null = null;

  selectContact(id: string | number) {
    this.selectedContactId = id;
  }

  groupedContacts = computed<ContactGroup[]>(() => {
    const sortedContacts = this.getSortedContacts();
    return this.buildContactGroups(sortedContacts);
  });

  constructor(private contactsService: ContactsService) {}

  onAddContact(): void {
    // Wire to router / dialog / form when add-contact flow exists
  }

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

