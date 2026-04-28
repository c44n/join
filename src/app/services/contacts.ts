import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase';
import { Contact } from '../models/contact';

export type NewContactInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  color?: string;
};

export type UpdateContactInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  color?: string;
};

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  constructor(private supabaseService: SupabaseService) {}

  async getContacts(): Promise<Contact[]> {
    const { data, error } = await this.supabaseService.supabase.from('contacts').select('*');
    
    if (error) {
      console.error('Error fetching contacts:', error);
      throw error;
    }

    return (data ?? []) as Contact[];
  }

  async createContact(input: NewContactInput): Promise<Contact> {
    const row = {
      first_name: input.first_name.trim(),
      last_name: input.last_name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      color: input.color ?? '#29abe2',
    };
    const { data, error } = await this.supabaseService.supabase
      .from('contacts')
      .insert(row)
      .select('*')
      .single();
    if (error) {
      console.error('Error creating contact:', error);
      throw new Error(error.message || 'Unknown Supabase error');
    }
    return data as Contact;
  }

  async updateContact(id: string, input: UpdateContactInput): Promise<void> {
    const row = {
      first_name: input.first_name.trim(),
      last_name: input.last_name.trim(),
      email: input.email.trim(),
      phone: input.phone.trim(),
      color: input.color ?? '#29abe2',
    };
    const { error } = await this.supabaseService.supabase.from('contacts').update(row).eq('id', id);
    if (error) {
      console.error('Error updating contact:', error);
      throw new Error(error.message || 'Unknown Supabase error');
    }
  }

  async deleteContact(id: string): Promise<void> {
    const { error } = await this.supabaseService.supabase.from('contacts').delete().eq('id', id);
    if (error) {
      console.error('Error deleting contact:', error);
      throw new Error(error.message || 'Unknown Supabase error');
    }
  }
}
