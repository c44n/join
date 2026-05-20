import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase';
import { Contact } from '../models/contact';

export type signUpInputs = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirm: string;
    color?: string;
};

@Injectable({
    providedIn: 'root',
})
export class Auth {
    constructor(private supabaseService: SupabaseService){
        //
    }

    async createContact(input: signUpInputs): Promise<Contact> {
        const row = {
            first_name: input.first_name.trim(),
            last_name: input.last_name.trim(),
            email: input.email.trim(),
            password: input.password.trim(),
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
}
