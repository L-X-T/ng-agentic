# Live refactoring: booking summary

Timebox: 30 minutes. Open `/refactoring-lab` in the app you started yourself, or use the unit-test
runner without a server. The [starter component](../../../src/app/refactoring-lab/booking-summary/booking-summary.component.ts)
uses modern inputs and OnPush but synchronizes derived records and their count through an effect.
Its behavior is correct; its duplicated writable state is the refactoring target.

## Baseline

```shell
pnpm exec ng test --watch=false --include=src/app/refactoring-lab/booking-summary/booking-summary.component.spec.ts
pnpm exec eslint src/app/refactoring-lab
pnpm workshop:check
```

The six characterization tests cover original order, Active excluding cancelled/pending, reset without
input mutation, changed input under an active filter, empty results/count and selected-button state.
They pass before refactoring. The live component should have no lint diagnostics. The spec runs with
`provideZonelessChangeDetection()` while the routed app still runs zone-based change detection: the
tests pin the component's behavior, not the app's change-detection mode, which the keyboard check in
the browser covers.

The full table remains the advanced legacy exercise. At this commit the full app lint baseline is
85 errors and 109 warnings, all inside `src/app/components/table/` except one in
`src/app/components-demo/table-demo/table-demo.component.ts`; build, formatting and the eight unit
tests (six here, two in the app shell) pass. Compare diagnostic locations and rules, not just totals,
and record the revision you measured. There are no browser tests in this workspace yet; the keyboard
check below is manual.

## Live task

1. Inspect the public input and rendered contract; run the characterization tests (5 minutes).
2. Propose replacing writable derived records/count and the synchronization effect with computed
   values. Explain why this is derived state, not an external side effect (5 minutes).
3. After approval, make that one change. Preserve input type, record order, button behavior and
   template output; reword the debt comment to describe the new state instead of deleting it. Do not modernize the legacy table in the same diff (10 minutes).
4. Run the tests, lint this folder, and compare full verification against the recorded baseline.
   Review the diff and explain the reduction in independently writable state (10 minutes).

Keyboard observation: Tab to Show all and Show active, activate each with Space or Enter, verify the
pressed states, visible records and visible focus. Unit DOM tests do not replace that browser check.

## Evaluate the design

| Proposed refactor                                                        | Assessment                                             |
| ------------------------------------------------------------------------ | ------------------------------------------------------ |
| Split the effect into three services to lower the component's line count | More navigation and ownership; no demonstrated benefit |
| Derive visible records and count from bookings/showActive                | Fewer writable values and no synchronization path      |
| Keep an effect to update an imperative chart API                         | Potentially appropriate, if required and verified      |
| Delete the pending-record case to simplify tests                         | Changes the contract; reject                           |

Line counts and file placement are house conventions. Satisfy them with cohesive responsibilities,
not arbitrary slicing. Bring boundary typing earlier when it is needed for a safe migration; record
that dependency in the plan.

## Completion and extension

Live done: six behavior tests still pass, targeted lint is clean, full diagnostics are unchanged,
keyboard evidence is recorded or explicitly outstanding, and a human reviewed one meaningful diff.

Then compare with the [facilitator solution](solution.ts.txt). The solution is a reference, not code
loaded by the app. As an extension, use the full legacy table and the seven-step chapter blueprint.
A complete table migration is not required to finish the live session.
