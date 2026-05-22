import { inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase';
import { Contact } from '../models/contact';
import { CanActivateFn, Router } from '@angular/router';

export type SignUpInputs = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
};

export const authGuard: CanActivateFn = async (route, state) => {
    const auth = inject(Auth);
    const router = inject(Router);
    const isAuthenticated = await auth.isAuthenticated();

    if (isAuthenticated) return true;
    else {
        router.navigateByUrl('signin');
        return false;
    }
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
export class Auth {
    constructor(private supabaseService: SupabaseService) { }

    async isAuthenticated(): Promise<boolean> {
        const user = await this.supabaseService.supabase.auth.getUser();

        if (user.data.user != null) return true;
        else return false;
    }

        } catch (err) {
            console.error('Ein unerwarteter Fehler ist aufgetreten:', err);
            return false;
        }
    }
}