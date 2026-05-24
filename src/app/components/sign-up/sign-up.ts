import { Component, inject, signal } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastService } from '../../services/toast';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
    selector: 'app-sign-up',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './sign-up.html',
    styleUrl: './sign-up.scss',
})
export class SignUp {
    protected saving = signal(false);
    protected errorMessage = signal<string | null>(null);

    private authService = inject(AuthService);
    private toastService = inject(ToastService);
    private router = inject(Router);

    registrationForm = new FormGroup({
        name: new FormControl('', {
            validators: [
                Validators.required,
                Validators.minLength(3),
                Validators.pattern(/^[a-zA-Zà-žÀ-Ž]{2,}(?: +[a-zA-Zà-žÀ-Ž]{2,})+ *$/),
            ],
        }),
        email: new FormControl('', {
            validators: [
                Validators.required,
                Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,6}'),
            ],
        }),
        password: new FormControl('', {
            validators: [
                Validators.required,
                Validators.minLength(8),
            ]
        }),
        password_confirm: new FormControl('', {
            validators: [Validators.required]
        }),
        privacy_policy: new FormControl(false, {
            validators: [Validators.requiredTrue]
        }),
    }, {
        validators: this.passwordMatchCheck
    });

    first_name = '';
    last_name = '';
    email = '';
    password = '';

    private passwordMatchCheck(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const password_confirm = control.get('password_confirm')?.value;

        return password === password_confirm ? null : { passwordMismatch: true };
    }

    checkInputValues() {
        const full = this.registrationForm.value.name?.trim() ?? '';
        this.email = this.registrationForm.value.email?.trim() ?? '';
        this.password = this.registrationForm.value.password?.trim() ?? '';

        if (full) {
            const space = full.indexOf(' ');
            this.first_name = space === -1 ? full : full.slice(0, space);
            this.last_name = space === -1 ? '' : full.slice(space + 1).trim();
        }
    }

    async createContact() {
        if (this.registrationForm.invalid) {
            this.registrationForm.markAllAsTouched();
            return;
        }

        this.saving.set(true);
        this.errorMessage.set(null);

        this.checkInputValues();

        const result = await this.authService.signUp({
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            password: this.password
        });

        this.saving.set(false);

        if (result) {
            this.toastService.show('You Signed Up successfully!');
            this.router.navigate(['/signin']); // Pfad anpassen, wohin der User nach dem Login soll
        } else {
            this.errorMessage.set('Registration failed. Please check your entries.');
            this.toastService.show('Fehler');
        }
    }
}