# Evaluation and first-week adoption

## Compare configurations

Use a task from your own project or the [booking-filter acceptance sheet](booking-filter.md). Record the unchanged
baseline revision, harness, available tools, instructions and acceptance cases. Run in separate
worktrees/sessions. Do not compare results from different specifications as if only the model changed.

| Run            | Model / reasoning | Accepted cases / total | Elapsed minutes | Review minutes | Repair attempts | Usage / cost and source | Unrequested changes |
| -------------- | ----------------- | ---------------------- | --------------- | -------------- | --------------- | ----------------------- | ------------------- |
| A1             |                   |                        |                 |                |                 |                         |                     |
| B1             |                   |                        |                 |                |                 |                         |                     |
| A2 (extension) |                   |                        |                 |                |                 |                         |                     |
| B2 (extension) |                   |                        |                 |                |                 |                         |                     |

Choose a configuration only after judging correctness and the task's impact. State sample size and
uncertainty; one pair is practice, not a benchmark. Useful outcomes include a reviewed implementation,
a confirmed diagnosis, a justified rejection, or a blocker that identifies genuinely missing data.

## Limits

| Limit                               | Value | Enforcement point | Verified behavior at limit | Owner |
| ----------------------------------- | ----- | ----------------- | -------------------------- | ----- |
| Runtime                             |       |                   |                            |       |
| Repair attempts                     |       |                   |                            |       |
| Tokens/spend, if enforceable        |       |                   |                            |       |
| Alert threshold (notification only) |       |                   |                            |       |

Do not fill an unavailable hard cap with an alert and label it enforced. If only a prompt limit exists,
say so. Consider narrower duties or supervised work when the available bounds are inadequate.

## First week

| Practice        | Concrete target                               | Owner / due date | Evidence of adoption                       |
| --------------- | --------------------------------------------- | ---------------- | ------------------------------------------ |
| Convention      | One observed recurring mistake and its cause  |                  | Before/after task results                  |
| Skill           | One repeated process, adapted to this project |                  | Match and boundary cases                   |
| Autonomous duty | One bounded, verifiable task                  |                  | Repair or blocker report within limits     |
| CI or review    | One useful feedback/reporting job             |                  | Reviewed first report and permission scope |

Compare your result with the goal written before class. If you did not reach it, record the actual
cause with evidence: setup, unclear behavior, verification gap, model/tool capability, scope or time.
Do not rewrite the original goal from memory to make the workshop look successful.

For team adoption, name the maintainers of instructions and skills, the change-review path, the home
for specs/decisions, and the human responsible for an agent-assisted PR. At the next team check-in,
review these concrete outcomes before adding another tool or expanding permissions.
