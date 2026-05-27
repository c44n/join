import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthSessionMissingError } from '@supabase/supabase-js';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  auth = inject(AuthService);
  isSignedin = signal<boolean>(false);

  constructor(){
    this.checkSignedIn();
    
  }

  async checkSignedIn() {
    const signin = await this.auth.isAuthenticated();
    const guestSignin = this.auth.isGuestSignIn();

    if (signin) this.isSignedin.set(true);
    else if(guestSignin) this.isSignedin.set(true);
    else this.isSignedin.set(false);
  }
}
