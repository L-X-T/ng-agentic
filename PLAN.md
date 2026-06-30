# PLAN — Registration page (`/register`)

Execution plan for [SPEC.md](SPEC.md). Ordered steps, each with concrete changes, a
checkpoint, and verification. Stop points are called out where output is worth a look before
continuing.

Guard rails (from AGENTS.md / global rules):

- Create `.ts` / `.html` / `.scss` only — **no `.spec.ts`**.
- Native control flow (`@if`), no `*ngIf`/`*ngFor`, no `[ngClass]`/`[ngStyle]`.
- `inject()` for DI, `input()`/signals, `OnPush`, standalone (no explicit `standalone: true`).
- Minimal diffs; don't touch unrelated files.
- No git staging/commit/push, no `ng serve` without approval.
- Before each edit, re-read the file (user may edit in parallel).

---

## Step 0 — Pre-flight (read-only)

- Read the relevant style guides before writing code:
  `style-guide/style-guide.ts.md`, `.html.md`, `.scss.md`, `.spec.md` (e2e section), `.a11y.md`.
- Confirm dev server status on `http://localhost:4200` (check only; do **not** start it).

**Checkpoint:** note any style-guide rule that changes the snippets below.

---

## Step 1 — Generate spartan-ng helm components ⚠️ biggest footprint — STOP & REVIEW after

Generate the four primitives needed:

```
ng g @spartan-ng/cli:ui button
ng g @spartan-ng/cli:ui input
ng g @spartan-ng/cli:ui card
ng g @spartan-ng/cli:ui label
```

Expected side effects (to verify, not assume):

- New `libs/` directory containing one Angular library per primitive.
- `tsconfig.json` (or `tsconfig.base.json`) gains `paths` entries under alias
  `@spartan-ng/helm/<name>` (e.g. `@spartan-ng/helm/button`, `.../card`, `.../input`,
  `.../label`).
- New library projects registered (angular.json or project-level `tsconfig.lib.json`/eslint).
- Possibly added dependencies in `package.json` (e.g. `@spartan-ng/helm`, `class-variance-authority`).

**Checkpoint (hard stop):**

1. `git status` to show exactly which files/dirs the generator added.
2. Open one generated lib (e.g. button) and record the **real exported symbol names** and
   selectors (`HlmButton`? `hlmBtn` directive? variant input name) — the template in Step 3
   depends on these. Same for input (`hlmInput`), card (container + content/header pieces),
   label (`hlmLabel`).
3. Confirm the app still type-checks / lints after generation (`ng lint`), before adding our
   own code on top.

> If the generator misbehaves in this non-Nx workspace, surface it here rather than pressing
> on — this is the riskiest step. Fallback options (manual helm copy, or plain styled native
> controls) would be discussed before proceeding.

---

## Step 2 — `RegistrationComponent` TypeScript (`src/app/registration/registration.ts`)

- Selector `app-registration`, `ChangeDetectionStrategy.OnPush`, external template + styles.
- Imports: spartan helm components/directives discovered in Step 1, plus Signal Forms.
- Signal Forms (`@angular/forms/signals` — confirm the field-binding directive name against the
  installed types: installed `@angular/forms@22` exposes `FormField` with selector `[formField]`;
  use whatever the types/generated docs confirm):

```ts
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { form, required, email, minLength, validate, submit /*, FormField */ } from '@angular/forms/signals';

@Component({
  selector: 'app-registration',
  imports: [/* FormField, Hlm* … */],
  templateUrl: './registration.html',
  styleUrl: './registration.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
  private readonly router = inject(Router);

  protected readonly model = signal({
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
    minLength(path.password, 8, { message: 'Password must be at least 8 characters.' });
    required(path.confirmPassword, { message: 'Please confirm your password.' });
    validate(path.confirmPassword, ({ value, valueOf }) =>
      value() !== valueOf(path.password) ? { kind: 'passwordMismatch', message: 'Passwords do not match.' } : null,
    );
  });

  protected async register(): Promise<void> {
    // submit() marks fields touched (reveals errors) and runs the action only when valid.
    await submit(this.registrationForm, async () => {
      console.log('Registration form result', this.registrationForm().value());
    });
  }

  protected cancel(): void {
    console.log('Registration cancelled');
    this.router.navigate(['/']);
  }
}
```

**Checkpoint:** the exact `required/email/minLength` config key for the message and the custom
error return shape are verified against the installed types while editing (adjust if the API
differs).

---

## Step 3 — Template (`src/app/registration/registration.html`)

- spartan **card** as the outer container (fixed ~20rem width applied via class in Step 4).
- Native `<form>` with five field blocks; each block = `hlmLabel` + `hlmInput` bound via the
  Signal Forms directive (`[control]`/`[formField]` per Step 1/2), plus an error region:
  ```html
  @if (registrationForm.email().touched() && registrationForm.email().errors().length) {
  <p class="field-error">{{ registrationForm.email().errors()[0].message }}</p>
  }
  ```
  Repeat per field. Both password inputs `type="password"`; e-mail `type="email"`.
- Footer row: **Register** (`hlmBtn`, `type="button"`, `(click)="register()"`, always enabled)
  and **Cancel** (`hlmBtn` secondary/outline variant, `type="button"`, `(click)="cancel()"`).
- a11y: every input has an associated `<label for>`/id; error text associated via
  `aria-describedby`; button text is descriptive. Native control flow only.

**Checkpoint:** quick AXE-mindset pass — labels linked, focus order sane, contrast from tokens.

---

## Step 4 — Styles (`src/app/registration/registration.scss`)

- Center the card in the viewport (flex container, full height).
- Card `width: 20rem` (fixed).
- Field stack with consistent vertical gap; footer buttons in a row (e.g. space-between).
- `.field-error` styled with the destructive token.
- **No media queries** (responsive explicitly out of scope). Prefer existing spartan/Tailwind
  tokens from `src/styles.scss`.

---

## Step 5 — Routing (`src/app/app.routes.ts`)

Replace the empty `routes` array with:

```ts
export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('./registration/registration').then((m) => m.RegistrationComponent),
  },
  { path: '', redirectTo: 'register', pathMatch: 'full' },
];
```

---

## Step 6 — App shell cleanup (`src/app/app.html`, `src/app/app.scss`)

- Replace the starter placeholder block (the file explicitly says it "can be replaced") with a
  minimal shell that renders just `<router-outlet />` (optionally a thin centered wrapper).
- Remove the now-unused inline `<style>` in `app.html` and unused rules in `app.scss`.
- Keep the change confined to the placeholder; don't alter `app.ts` logic beyond what's needed
  (it can keep its `title` signal or drop it if unused — minimal-diff judgement).

**Checkpoint:** `/register` renders the form as the visible page (no starter splash above it),
and `/` redirects to it.

---

## Step 7 — Playwright e2e (`e2e/registration.spec.ts`)

Full submit flow (mirrors existing `e2e/smoke.spec.ts` conventions):

```ts
import { expect, test } from '@playwright/test';

test('register logs the form result to the console', async ({ page }) => {
  const consoleMessages: string[] = [];
  page.on('console', (msg) => consoleMessages.push(msg.text()));

  await page.goto('/register');

  // fill by label/role — selectors finalized against the rendered DOM
  await page.getByLabel('First name').fill('Ada');
  await page.getByLabel('Last name').fill('Lovelace');
  await page.getByLabel('E-mail').fill('ada@example.com');
  await page.getByLabel('Password', { exact: true }).fill('supersecret');
  await page.getByLabel('Confirm password').fill('supersecret');

  await page.getByRole('button', { name: 'Register' }).click();

  await expect.poll(() => consoleMessages.some((m) => m.includes('ada@example.com'))).toBeTruthy();
});
```

**Checkpoint:** label/role selectors are finalized against the actual rendered template; the
spartan label↔input association must make `getByLabel` work (otherwise fall back to ids).

---

## Step 8 — Verify & report

- `ng lint` → zero new errors/warnings.
- Type-check/build (`ng build` or equivalent) passes.
- `npx playwright test e2e/registration.spec.ts` passes (needs `:4200` up; will check first and
  ask before starting `ng serve`).
- Report: files added/changed, the spartan footprint from Step 1, and any API detail that
  differed from this plan.

---

## Files touched (summary)

| Action    | Path                                                                            |
| --------- | ------------------------------------------------------------------------------- |
| add       | `src/app/registration/registration.ts`                                          |
| add       | `src/app/registration/registration.html`                                        |
| add       | `src/app/registration/registration.scss`                                        |
| add       | `e2e/registration.spec.ts`                                                      |
| edit      | `src/app/app.routes.ts`                                                         |
| edit      | `src/app/app.html`, `src/app/app.scss`                                          |
| generated | `libs/**`, `tsconfig*` paths, possibly `angular.json` / `package.json` (Step 1) |

## Open risks

1. **Spartan generator in a non-Nx Angular CLI workspace** (Step 1) — heaviest footprint and
   the most likely place to need a course-correction. Hard checkpoint after it.
2. **Signal Forms directive name** (`[control]` vs `[formField]`) and validator config shape —
   verified against installed `@angular/forms@22` types while coding.
3. **`getByLabel` association** in e2e depends on how spartan label/input wire `for`/`id`.
