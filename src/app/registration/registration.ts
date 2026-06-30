import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { email, form, FormField, minLength, required, validate } from '@angular/forms/signals';
import { HlmButton, HlmCard, HlmCardContent, HlmInput, HlmLabel } from '../ui';
import { RegistrationModel } from './registration.model';

const PASSWORD_MIN_LENGTH = 8;

@Component({
  selector: 'app-registration',
  imports: [FormField, HlmCard, HlmCardContent, HlmInput, HlmLabel, HlmButton],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  private readonly router = inject(Router);

  protected readonly model = signal<RegistrationModel>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  protected readonly registrationForm = form(this.model, (path) => {
    required(path.firstName, { message: 'First name is required.' });
    required(path.lastName, { message: 'Last name is required.' });
    required(path.email, { message: 'E-mail is required.' });
    email(path.email, { message: 'Enter a valid e-mail address.' });
    required(path.password, { message: 'Password is required.' });
    minLength(path.password, PASSWORD_MIN_LENGTH, {
      message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
    });
    required(path.confirmPassword, { message: 'Please confirm your password.' });
    validate(path.confirmPassword, ({ value, valueOf }) =>
      value() !== valueOf(path.password) ? { kind: 'passwordMismatch', message: 'Passwords do not match.' } : undefined,
    );
  });

  // Reveals validation errors only after the first submit attempt, while keeping
  // the Register button enabled at all times (per the prototype requirement).
  protected readonly hasSubmitted = signal(false);

  protected onRegister(event: Event): void {
    event.preventDefault();
    this.hasSubmitted.set(true);

    if (this.registrationForm().invalid()) {
      return;
    }

    // No backend yet: log the collected form result.
    console.log('Registration form result', this.registrationForm().value());
  }

  protected onCancel(): void {
    console.log('Registration cancelled');
  }
}
