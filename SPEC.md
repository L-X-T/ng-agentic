# SPEC — Registration page (`/register`)

First-prototype registration form. No backend, no responsive design. Angular 22, zoneless,
signal-based, Signal Forms, spartan-ng (helm) components, Playwright e2e.

## Goal

A `/register` route rendering `RegistrationComponent`: a card (~20rem wide) containing a
registration form. On **Register**, the form result is logged to the console; on **Cancel**,
the app navigates "home".

## Decisions (from clarification)

| Topic      | Decision                                                                                                                                                                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Validation | **Full** validation: all fields required, e-mail format, password min length, and the two passwords must match. **Register stays enabled at all times.** Clicking Register reveals validation errors; the form result is logged to the console **only when the form is valid**. |
| Cancel     | `console.log` a cancellation message, then router-navigate to `/` (home).                                                                                                                                                                                                       |
| Routing    | Lazy `/register` route via `loadComponent`, **plus** redirect `'' → /register`.                                                                                                                                                                                                 |
| E2E        | Full submit flow: visit `/register`, fill all fields with valid data, click Register, assert the form result is logged to the console.                                                                                                                                          |

### Known consequence (accepted)

Because `''` redirects to `/register` **and** Cancel navigates to `/`, clicking Cancel logs a
cancellation message to the console and then resolves back to `/register` — i.e. Cancel
effectively logs and reloads a fresh, empty form. Accepted for this no-backend prototype.

## Form fields

| Field            | Model key         | Validation                       |
| ---------------- | ----------------- | -------------------------------- |
| First name       | `firstName`       | required                         |
| Last name        | `lastName`        | required                         |
| E-mail           | `email`           | required + e-mail format         |
| Password         | `password`        | required + min length 8          |
| Confirm password | `confirmPassword` | required + must equal `password` |

Both password inputs use `type="password"`.

## Implementation plan

### 1. Generate spartan-ng helm components _(main prerequisite / risk)_

The helm UI components are **not** present yet (only `@spartan-ng/brain` + `@spartan-ng/cli`
are installed; no `libs/` dir, no tsconfig path mappings). Generate the needed primitives via
the spartan CLI generator:

```
ng g @spartan-ng/cli:ui button
ng g @spartan-ng/cli:ui input
ng g @spartan-ng/cli:ui card
ng g @spartan-ng/cli:ui label
```

- This scaffolds the `Hlm*` components/directives (and may run an init step that creates a
  `libs/`-style directory and adds tsconfig path mappings). The exact output layout and import
  paths will be confirmed at implementation time from the generated files.
- Components/directives expected: `hlmBtn` (button, with `secondary`/`outline` variant for
  Cancel), `hlmInput` (input), `hlm-card` family (card container/content), `hlmLabel` (label).
- New generated files are an accepted, in-scope side effect of "use ng-spartan components".

### 2. `RegistrationComponent`

Location: `src/app/registration/` — `registration.ts`, `registration.html`, `registration.scss`
(no `.spec.ts`, per AGENTS.md). Selector `app-registration`, `ChangeDetectionStrategy.OnPush`,
standalone (default).

Signal Forms wiring (`@angular/forms/signals`):

```ts
protected readonly model = signal({
  firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
});

protected readonly registrationForm = form(this.model, (path) => {
  required(path.firstName);
  required(path.lastName);
  required(path.email);
  email(path.email);
  required(path.password);
  minLength(path.password, 8);
  required(path.confirmPassword);
  validate(path.confirmPassword, ({ value, valueOf }) =>
    value() !== valueOf(path.password)
      ? { kind: 'passwordMismatch', message: 'Passwords do not match.' }
      : null,
  );
});
```

Submit (reveals errors + logs only when valid — `submit()` marks fields touched and runs the
action only if the form is valid):

```ts
protected async register(): Promise<void> {
  await submit(this.registrationForm, async () => {
    console.log('Registration form result', this.registrationForm().value());
  });
}

protected cancel(): void {
  console.log('Registration cancelled');
  this.router.navigate(['/']);
}
```

`router = inject(Router)`.

### 3. Template (`registration.html`)

- spartan card (~`width: 20rem`) wrapping a native `<form>`.
- Each field: `hlmLabel` + `hlmInput`, with an error region shown when the field is touched
  and has errors, e.g.:
  ```html
  @if (registrationForm.email().touched() && registrationForm.email().errors().length) {
  <p class="error">…</p>
  }
  ```
- Inputs bound with the Signal Forms directive: `[control]="registrationForm.firstName"`
  (exact directive selector — `control` vs `formField` — confirmed against the generated/
  installed `@angular/forms` types during implementation; installed types expose `FormField`
  with selector `[formField]`).
- Footer: primary **Register** button (`hlmBtn`, `type="button"`, `(click)="register()"`,
  always enabled) and secondary **Cancel** button (`hlmBtn` secondary variant,
  `(click)="cancel()"`).
- Native control flow only (`@if`/`@for`), no `*ngIf`. No `[ngClass]`/`[ngStyle]`.

### 4. Styling (`registration.scss`)

- Center the card in the viewport; card fixed `width: 20rem`.
- Vertical stack of fields with consistent gap; buttons row at the bottom.
- No media queries / responsive rules (explicitly out of scope).
- Lean on spartan/Tailwind tokens already defined in `src/styles.scss`.

### 5. Routing (`src/app/app.routes.ts`)

```ts
export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./registration/registration').then((m) => m.RegistrationComponent),
  },
  { path: '', redirectTo: 'register', pathMatch: 'full' },
];
```

### 6. App shell cleanup (`src/app/app.html`)

The current `app.html` always renders the large Angular starter splash **above**
`<router-outlet/>`, so the routed form would appear beneath it. The file marks that content as
"only a placeholder ... can be replaced", so replace the placeholder with a minimal shell that
just renders `<router-outlet />` (and trim the now-unused styles in `app.html`/`app.scss`).
This keeps the change confined to the placeholder the starter invites us to replace.

### 7. Playwright e2e (`e2e/registration.spec.ts`)

Full submit flow:

1. Collect console messages via `page.on('console', …)`.
2. `page.goto('/register')`.
3. Fill First name, Last name, E-mail (valid), Password, Confirm password (matching) — located
   by label/role/placeholder.
4. Click **Register**.
5. Assert a console message was logged containing the submitted form result (e.g. the e-mail
   value). Reuses the existing Playwright config (`baseURL` `http://localhost:4200`).

## Out of scope

Backend/HTTP, responsive/mobile layouts, password strength meter, i18n, `.spec.ts` unit tests,
success/redirect-after-register behavior.

## Verification before "done"

- `ng lint` (or `npx ng lint`) — zero new errors/warnings.
- TypeScript build passes (`ng build` or type-check).
- `npx playwright test e2e/registration.spec.ts` passes against a running dev server on `:4200`
  (will not start `ng serve` without approval — per AGENTS.md, check `:4200` first).
