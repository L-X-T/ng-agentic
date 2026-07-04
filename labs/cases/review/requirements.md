# Review the booking filter

Timebox: 15 minutes. These text fixtures are deliberately defective review material, outside the
compiled app. Do not install or apply them to production.

## Contract and scope

Review [after.ts.txt](after.ts.txt) against [before.ts.txt](before.ts.txt), plus the newly added
[template](after.html.txt). The caller owns sorting and supplies records in the chosen order.
The function must preserve that order and the caller's array. All shows every status; Active shows
only active records, including when pending records exist. The reset button must have the accessible
name "Reset filter".

The caller supplies a required Filter value; its native select handler narrows values to all/active.
No persistence, service API change, or extra sorting is authorized.

```shell
git diff --no-index labs/cases/review/before.ts.txt labs/cases/review/after.ts.txt
```

Exit status 1 means the files differ; it is expected here. Read the template separately as a new file.
This is an illustrative change with no Git commit to merge.

## Inputs and evidence

Use B3/active/Sam, B1/active/Ada, B4/pending/Jo and B2/cancelled/Lin, in that order.
Predict output and input-array state for both filters. Inspect the reset button's accessible name.
Record the requirement, file/line, reproduction, impact and proposed disposition for every finding.

Read the raw change yourself first. Then ask a fresh read-only reviewer for correctness and style
findings. Include the contract and note that the text fixtures were not compiled or browser-tested.
Don't claim that a production build verified these excluded files.

Finally assess this proposed finding: "The array copy in the All branch is a critical defect because
it changes the result's identity." Does the contract require stable identity? What evidence would
justify that severity?

After recording your own verdict, compare with the [facilitator key](facilitator.md).
