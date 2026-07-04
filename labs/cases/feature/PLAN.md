# Plan: booking status filter

Prerequisite: the human has approved [SPEC.md](SPEC.md). File names below must be resolved against
the participant's project; do not invent a service path.

| Step         | Concrete work                                                  | Evidence / checkpoint                              |
| ------------ | -------------------------------------------------------------- | -------------------------------------------------- |
| Inspect      | Locate the list, status type, sorting owner and existing tests | Confirm scope and baseline; no production edits    |
| Characterize | Pin original order and data ownership                          | Existing behavior tests pass                       |
| Implement    | Local filter selection and derived visible records             | Active shows only active; All restores all records |
| Present      | Labeled control, reset action, empty result                    | Keyboard and accessible-name observations          |
| Verify       | Run all acceptance cases and the verification contract         | Results tied to final files                        |
| Review       | Compare the diff with the approved spec                        | Human review and commit                            |

Do not approve the plan merely because it repeats the spec. It must identify files, ownership,
verification and a reviewable sequence. Planning selects how to implement the approved outcome;
it cannot quietly change that outcome.
