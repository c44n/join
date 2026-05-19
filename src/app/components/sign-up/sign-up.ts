import { Component, inject, signal } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { ToastService } from '../../services/toast';
import { ValidationError } from '@angular/forms/signals';
import { Router, RouterLink } from '@angular/router';


@Component({
    selector: 'app-sign-up',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './sign-up.html',
    styleUrl: './sign-up.scss',
})
export class SignUp {
    router = inject(Router);

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
    }, {
        validators: this.passwordMatchCheck
    });

    get nameControl() { return this.registrationForm.get('name'); }
    get emailControl() { return this.registrationForm.get('email'); }
    get passwordControl() { return this.registrationForm.get('password'); }
    get confirmControl() { return this.registrationForm.get('password_confirm'); }

    private passwordMatchCheck(control: AbstractControl): ValidationErrors | null {
        const password = control.get('password')?.value;
        const password_confirm = control.get('password_confirm')?.value;

        return password === password_confirm ? null : { passwordMismatch: true };
    }

    createContact() {
        if (this.registrationForm.valid) {
            console.log('gut');

            this.router.navigate(["dashboard"]);
        }
    }

}
