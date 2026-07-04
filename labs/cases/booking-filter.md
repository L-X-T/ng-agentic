# Booking filter acceptance sheet

Use this same task for every prompting level, in one of two ways:

- **Map it onto your project (default).** The task is a status filter on a sortable list. Pick a
  list in your project that has a status-like field and sorting – orders, tickets, recipes with a
  "draft/published" flag – and translate the terms: "booking" becomes your entity, "cancelled" and
  "active" become two values of your field, the three records below become your fixture. Name the
  actual component and service paths before running; the example path `src/app/bookings/` is not a
  claim that it exists anywhere. If no list fits, add a minimal one (three records, sortable by
  label) before saving the baseline, so every run starts from the same code.
- **Bring your own task.** If you would rather practice on a task your project needs, write your
  own sheet first, using this one as the template: fixed inputs, six observable acceptance cases
  with the evidence to record, and the comparison table. Keep it fixed across all runs, and write it
  before the first prompt – a sheet written after seeing the diff measures the diff, not the prompt.

## Baseline and inputs

Save the base revision. Create a separate disposable worktree for each run from that revision,
install with the lockfile, and use a fresh session with the same harness/model settings. Do not
discard unrelated work or use `git reset --hard` to prepare a comparison.

Use these records in this order:

| ID  | Status    | Label |
| --- | --------- | ----- |
| B2  | cancelled | Lin   |
| B3  | active    | Sam   |
| B1  | active    | Ada   |

For A5 only, use a second input that contains just B2 (cancelled, Lin).

The current list shows all records and supports sorting. Add an accessible status filter with
"All" and "Active" choices. Initial choice is All. Selection is local to the view and resets on
reload; persistence and changes to the service API are out of scope.

## Acceptance cases

| ID  | Given / when                                         | Expected result                                         | Evidence to record         |
| --- | ---------------------------------------------------- | ------------------------------------------------------- | -------------------------- |
| A1  | Load the list                                        | All three IDs appear in the initial order               | Visible IDs or test output |
| A2  | Choose Active                                        | Only B3 and B1 appear, in that order                    | Visible IDs or test output |
| A3  | Return to All                                        | All three records return; original data was not mutated | IDs and original input     |
| A4  | Sort by label ascending, then choose Active          | Ada precedes Sam; filtering preserves the chosen sort   | Order                      |
| A5  | Load the A5 input (only B2); choose Active           | "No active bookings" appears                            | Empty state                |
| A6  | Use keyboard only                                    | Filter has an accessible name and both choices work     | Interaction notes          |

Static checks must still pass against the recorded baseline. Existing tests that do not exercise
A1–A6 cannot establish those requirements. A no-op implementation can pass all existing tests:
ask the reviewer to explain exactly which acceptance case disproves it.

## Compare runs

| Run                 | Revision / model | Useful questions | Acceptance cases passed | Review minutes | Unrequested changes |
| ------------------- | ---------------- | ---------------- | ----------------------- | -------------- | ------------------- |
| Five-part prompt    |                  |                  |                         |                |                     |
| Interactive prompt  |                  |                  |                         |                |                     |
| Grilling (optional) |                  |                  |                         |                |                     |

Write the vague prompt first and predict what it leaves undecided. Running it is optional.
Give every implementation the same final contract. If the interview changes that contract,
record the difference and do not attribute the changed result only to prompting style.
One run per style is a demonstration; repeat runs before making reliability claims.

## Handover check

Record decisions, rejected alternatives, exact revision, dirty files, executed checks and the next
slice of work. In a fresh session, ask for the next action and its verification before editing.
The next agent should preserve decisions while flagging contradictory code evidence. Reopening a
decision requires a concrete reason, not a preference for a different design.
