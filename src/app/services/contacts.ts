import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase';
import { Contact } from '../models/contact';


@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor(private supabaseService: SupabaseService) {}

  async getContacts(): Promise<Contact[]> {
    const { data, error } = await this.supabaseService.supabase.from('contacts').select('*');

    console.log('data size == ', data?.length);

    if (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }

    return (data ?? []) as Contact[];
  }
}
