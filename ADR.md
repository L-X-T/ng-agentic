# Architecture Decision Records

## ADR-001: Keep the Register button always enabled and reveal validation errors on submit

- **Status:** Accepted
- **Date:** 2026-06-30
- **Context scope:** Registration form (`/register`, `RegistrationComponent`)

### Context

The registration form uses Angular Signal Forms with full client-side validation (all
fields required, e-mail format, password minimum length, and matching passwords).

A common pattern is to **disable** the primary submit button until the form is valid. During
planning this was the initially proposed behavior. It was rejected in favor of an
always-enabled button.

### Decision

The **Register** button stays **enabled at all times**, regardless of form validity.

When the user clicks Register:

- If the form is **invalid**, submission is blocked and the **validation errors are revealed**
  for the offending fields (errors surface on the first submit attempt, in addition to being
  shown once a field is touched).
- If the form is **valid**, the form result is processed (currently logged to the console, as
  there is no backend yet).

Implementation: a `hasSubmitted` signal flips to `true` on the first submit attempt and gates
error display alongside each field's `touched` state; the submit handler returns early when
`registrationForm().invalid()` is `true`.

### Rationale

- **Discoverability:** A disabled button gives no feedback about _why_ it is disabled. Letting
  the user click and then showing concrete, per-field errors is more instructive than a
  silently inert button.
- **Accessibility:** Disabled buttons are not focusable/announced consistently and can be
  confusing for keyboard and screen-reader users; an enabled button with clear error messaging
  avoids that ambiguity.
- **Simplicity for the prototype:** Avoids wiring the button's disabled state to live form
  validity, keeping the first prototype straightforward.

### Consequences

- Users can attempt to submit an invalid form; this is intentional and handled by revealing
  errors rather than by preventing the click.
- Error visibility is driven by both per-field `touched` state and the `hasSubmitted` flag, so
  errors appear immediately on a submit attempt even for fields the user never focused.
- If a backend is added later, the submit handler must continue to guard on validity before
  issuing the request.

## ADR-002: Keep domain models in their own files

- **Status:** Accepted
- **Date:** 2026-06-30
- **Context scope:** Project-wide

### Context

Model/entity types (e.g. `RegistrationModel`) were initially declared inline in the component
that used them.

### Decision

Domain model types live in their own co-located file (e.g.
`registration/registration.model.ts`), separate from the component, service, or template that
consumes them.

### Rationale

- Keeps components focused on presentation/behavior rather than data shape definitions.
- Makes models independently importable and reusable across components, services, and tests
  without creating a dependency on a component file.
- Easier to locate and evolve the data contract on its own.

### Consequences

- Each model gets a dedicated `*.model.ts` file, co-located with the feature that owns it.
- One extra file per model; the type must be exported and imported where used.
