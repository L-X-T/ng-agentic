# Decision: keep filter selection local

Status: accepted within this worked example.

## Context

Remembering the last selection could be convenient, but persistence introduces reload semantics,
storage failures and cross-view behavior that the current task does not need.

## Decision

Keep selection local to the view. Reload starts with All. Derive visible records without mutating the
service's array; the existing sorting owner continues to determine order.

## Alternatives and consequences

URL or local-storage persistence is deferred. There is no storage dependency and no preference to
migrate. If persistence becomes a requirement, revise the spec and acceptance cases before changing
the plan. This record explains why; it does not duplicate the implementation steps.
