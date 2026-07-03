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
