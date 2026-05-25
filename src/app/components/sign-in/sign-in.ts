import { Component, inject, signal } from '@angular/core';
import { Sidebar } from '../sidebar/sidebar';
import { Header } from '../header/header';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { validate } from '@angular/forms/signals';
import { SupabaseService } from '../../services/supabase';
import { AuthService } from '../../services/auth';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.scss',
})
export class SignIn {
  supabaseService = inject(SupabaseService);
  authService = inject(AuthService);
  router = inject(Router);
  toastsService = inject(ToastService);

  signInForm = new FormGroup({
    email: new FormControl('', {
      validators: [
        Validators.required,
        Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,6}'),
      ],
    }),
    password: new FormControl('', { validators: [Validators.required, Validators.minLength(8)] }),
  });

  get email() {
    return this.signInForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
  }


  async authenticate() {
    const emailValue = this.email?.value as string;
    const passwordValue = this.password?.value as string;

    const { data, error } = await this.supabaseService.supabase.auth.signInWithPassword({
      email: emailValue,
      password: passwordValue,
    });

    if (error?.code == 'invalid_credentials') {
      this.toastsService.show('your email or password is not correct');
    } else if (error) console.error(error);
    else {
      if (data.user?.role == 'authenticated') {
        // after sign in successfully, redirected to summary page
        this.router.navigateByUrl('/summary');
      }
    }
  }

  guestSignIN() {
    this.authService.isGuestSignIn.set(true);

    this.router.navigateByUrl('/summary');
  }
}
