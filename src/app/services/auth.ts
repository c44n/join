import { computed, inject, Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase';
import { Contact } from '../models/contact';
import { CanActivateFn, CanMatchFn, Route, Router, UrlSegment } from '@angular/router';

export type SignUpInputs = {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
};

export const signInGuard: CanActivateFn = async (route, state) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const isSignedIn: boolean = await auth.isAuthenticated();

    if (isSignedIn || auth.isGuestSignIn() == "signIn") {
        router.navigateByUrl('/summary');
        return false;
    }

    return true;
};

export const checkAuthGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
    const auth = inject(AuthService);
    await auth.isAuthenticated();
    return true;
};

export const authGuard: CanMatchFn = async (route: Route, segments: UrlSegment[]) => {
    const auth = inject(AuthService);
    const router: Router = inject(Router);
    const isAuthenticated: boolean = await auth.isAuthenticated();
    
    if (isAuthenticated) return true;
    else if (auth.isGuestSignIn() == "signIn") return true;
    else {
        router.navigateByUrl('');
        return false;
    }
};

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private supabaseService = inject(SupabaseService);

    isGuestSignIn = signal<'signIn' | 'signOut'>('signOut');
    isUserSignIn = signal<boolean>(false);

    async isAuthenticated(): Promise<boolean> {
        const user = await this.supabaseService.supabase.auth.getUser();
        const guestUser = localStorage.getItem('guestUser');

        if (user.data.user != null) {
            this.isUserSignIn.set(true);
            return true;
        } else if (guestUser == 'signIn') {
            this.isGuestSignIn.set('signIn');
            return true;
        } else {
            this.isUserSignIn.set(false);
            return false;
        }
    }

    async signUp(inputs: SignUpInputs): Promise<boolean> {
        try {
            const authResponse = await this.supabaseService.supabase.auth.signUp({
                email: inputs.email,
                password: inputs.password,
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

            const dbResponse = await this.supabaseService.supabase.from('contacts').insert({
                user_id: newUserId,
                first_name: inputs.first_name,
                last_name: inputs.last_name,
                email: inputs.email,
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
