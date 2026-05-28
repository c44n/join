import { Component, computed, inject, OnInit, signal } from '@angular/core';
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
  isSignedin = computed(() => {
    if (this.auth.isUserSignIn() || this.auth.isGuestSignIn() == "signIn") return true;
    else return false;
  });
}
