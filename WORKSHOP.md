# Delivering and evaluating the workshop

## Start here

Use Lab 00 before class and Lab 01 for the harness. The required path uses one coding agent,
Angular MCP, project instructions, lint/format checks, and a unit-test baseline. Other harnesses,
Spartan, Figma, browser automation, and companion apps are extensions when a task needs them.

By the end, participants should be able to name the instructions an agent loaded, inspect a useful
tool call, verify a change against observable behavior, and justify whether agent assistance helped.
Keep a short mandatory goal before starting: "By the end I can demonstrate **_ by _**." Stretch goals
are optional. A participant may conclude that a task is better done without an agent.

## Chapter checkpoints

The branch history is the curriculum. Each chapter branch includes its predecessors. Later code,
packages, and examples must not become prerequisites of an earlier chapter. The early harness also
has individual commits for formatting, hooks, ESLint, style guides, and agent instructions.

The `setup` branch starts at the `add labs` commit. Run the [verification contract](VERIFICATION.md)
at this checkpoint. Use the facilitator's saved revision when following along; don't change branches
with uncommitted work. Use a separate worktree when comparing versions.

## Delivery record

Fill this in before each delivery. Unknown or untested entries stay explicit.

| Field                      | Record                                                             |
| -------------------------- | ------------------------------------------------------------------ |
| Material owner             | Facilitator's name                                                 |
| Delivery date and revision | Date; branch; `git rev-parse HEAD`                                 |
| Tested environment         | OS; Node; exact pnpm from package.json                             |
| Agent                      | Product, CLI/app/IDE, version, model, sign-in checked              |
| Tool access                | Loaded instruction file; successful Angular MCP call               |
| Static baseline            | Results from VERIFICATION.md, diagnostics and exceptions           |
| Browser baseline           | URL, app revision, smoke observation; automated specs if installed |
| External guidance          | Official source, date checked, changed capability                  |
| Outstanding issues         | Owner, workaround, and whether class can proceed                   |

Do not label an entire environment "tested" because one command worked. Keep the actual report
alongside this record. Installing dependencies must preserve the lockfile.

## One-day schedule

Lab 00 is pre-work (about 30 minutes). This schedule assumes a 09:00–16:30 day; align the intro deck's
timetable slide with it before delivery.
Every taught block includes a short demonstration and debrief; the practice checkpoint is the required
live outcome. Adjust after observing a delivery, not by quietly moving required work into homework.

| Time        | Block                  | Required live evidence                                      | Extension / homework                    |
| ----------- | ---------------------- | ----------------------------------------------------------- | --------------------------------------- |
| 09:00–09:20 | Introduction and goals | Saved, observable personal goal                             | Stretch goal                            |
| 09:20–10:15 | Setup                  | Instruction path, MCP call, verified counter                | Additional tools/harnesses              |
| 10:15–10:50 | Skills                 | One skill run; authored match/boundary cases                | Five-case evaluation and portability    |
| 10:50–11:10 | Break                  |                                                             |                                         |
| 11:10–11:45 | Prompting              | Fixed acceptance sheet and comparison observations          | Grilling and handover run               |
| 11:45–12:20 | Reviewing              | Scoped findings and evidence-based dispositions             | Own-project repair/commit               |
| 12:20–13:10 | Lunch                  |                                                             |                                         |
| 13:10–13:45 | HITL                   | Tiny reviewed change; trace worked feature artifacts        | Implement feature; integration exercise |
| 13:45–14:25 | Autonomy               | Goal-driven run; Case 2 blocker report on the prepared path | Boundary probe; scheduling/parallelism  |
| 14:25–14:45 | Break                  |                                                             |                                         |
| 14:45–15:30 | Refactoring            | One small characterized state refactor and review           | Full legacy table / workspace update    |
| 15:30–15:55 | Outlook                | Adoption owners, comparison design and limits               | Repeated configuration runs             |
| 15:55–16:30 | Questions and feedback | Evidence and unresolved blockers                            | Team follow-up                          |

## Release and feedback checklist

- Record the material owner, delivery revision and actual tested tool versions.
- Verify chapter ancestry and run each checkpoint with its own lockfile. Never copy later dependencies
  backward to make an early chapter pass.
- Run `pnpm workshop:material` and the [verification contract](VERIFICATION.md). Verify the intentionally
  red autonomy fixture separately; it is excluded from the app suite.
- Read each live definition of done against the schedule. Keep advanced requirements in the extension.
- Check official capability links and record the date. Inspect changed PDF/lab pages visually.
- Keep verification commands in VERIFICATION.md and its runner; link other chapters to that contract.
  Update chapter-specific behavior cases where the behavior is taught.
- Collect time to first useful result, checkpoint reached, blocking step, and one rejected agent claim.
  At the next delivery, change the exercise or guidance that the evidence identifies.
- After one week, ask which convention, skill or feedback loop was adopted and what evidence supports it.

The completed [adoption sheet](labs/cases/adoption.md) is the participant's take-home record.

## Last static verification

On 2026-09-05, the revised setup checkpoint passed build, lint, formatting and both starter unit
tests on macOS with Node 22.23.2 and pnpm 10.29.3. The local material check passed too.
This records static execution only; agent account access, MCP discovery and browser interaction
remain participant preflight checks. Re-run on the revision supplied for the next delivery.

## Facilitation

Allow time for a demonstration, practice, and a short evidence-based debrief. For setup, budget
10 minutes to map the harness, 30 minutes for the required path, and 15 minutes for verification
and recovery. Existing projects can skip steps already proven. Additional tools are homework.

For each exercise, ask: what did you observe, what changed, what proves it, and what remains uncertain?
Record the checkpoint reached and the blocking step. Compare delivery records after class and adjust
the time budget or exercise rather than silently expanding the required work.

Companion apps are personal preferences. Participants can complete the workshop with their existing
terminal/editor, a browser, Git, and one supported coding agent.
