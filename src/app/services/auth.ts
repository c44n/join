import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase';

export type SignUpInputs = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
};

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private supabaseService = inject(SupabaseService);

    async signUp(inputs: SignUpInputs): Promise<boolean> {
        try {
            const authResponse = await this.supabaseService.supabase.auth.signUp({
                email: inputs.email,
                password: inputs.password
            });

            if (authResponse.error) {
                console.error('Fehler bei Auth:', authResponse.error.message);
                return false;
            }

            const newUserId = authResponse.data.user?.id;

            if (!newUserId) {
                console.error('Keine User ID erhalten.');
                return false;
            }

            const dbResponse = await this.supabaseService.supabase
                .from('contacts')
                .insert({
                    user_id: newUserId,
                    first_name: inputs.first_name,
                    last_name: inputs.last_name,
                    email: inputs.email
                });

            if (dbResponse.error) {
                console.error('Fehler beim Speichern in Contacts:', dbResponse.error.message);
                return false;
            }

            return true;

        } catch (err) {
            console.error('Ein unerwarteter Fehler ist aufgetreten:', err);
            return false;
        }
    }
}