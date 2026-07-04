# Feature spec: booking status filter

Status: worked example for review, not an instruction to implement automatically.

## Outcome

Users can show only active bookings and return to the complete list without changing its data or sort.
Use the [six acceptance cases](../booking-filter.md) and add two: A7, with a pending record in the input,
Active hides it; A8, the reset control returns to All and has the accessible name "Reset filter".
Initial selection is All.

## Boundaries

Selection lives in the view and resets on reload. No service API change, storage, new dependency,
or backend behavior. Loading and errors retain the application's existing handling.

## Review gate

The human approves the behavior and boundaries before planning. Reject a plan that adds persistence
or treats pending bookings as active. Record unanswered questions rather than choosing silently.

Continue with [PLAN.md](PLAN.md), [ADR.md](ADR.md), and [the change/integration exercise](CHANGE.md).
