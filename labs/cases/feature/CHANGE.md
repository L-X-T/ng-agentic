# Requirement change and integration exercise

## A change during implementation

The stakeholder now asks: "Remember Active after reload."

Pause at the behavior boundary. Decide whether to accept the scope increase. If accepted:

1. Revise SPEC.md: define whether the preference belongs to a URL, device or user, plus its fallback.
2. Supersede the local-only decision in ADR.md; preserve its original reasoning.
3. Add acceptance case A9 for reload and the chosen failure/reset semantics.
4. Revise PLAN.md with the affected files and tests, then obtain approval before implementation.

Trace one requirement from spec to decision to plan to test evidence to reviewed diff.
Updating only the plan leaves the reviewer with contradictory requirements.

## Two passing branches can still combine incorrectly

Branch A introduces pending bookings and tests their display under All. Branch B implements Active
by excluding cancelled bookings and tests only active/cancelled fixtures. Both branches can pass
their own checks. Their text changes can merge without a Git conflict, yet pending bookings leak
into Active.

Use the [prepared review case](../review/requirements.md) as the integrated result. Add pending
records to the acceptance input and verify Active means active, not merely "not cancelled".

In a pair exercise, assign these assumptions to separate worktrees. Before integration, exchange
the changed contracts. The human reviews/commits each branch, integrates one at a time, then runs
combined acceptance cases and the [verification contract](../../../VERIFICATION.md).
Worktree isolation separates files and indexes; it does not prove semantic independence.
