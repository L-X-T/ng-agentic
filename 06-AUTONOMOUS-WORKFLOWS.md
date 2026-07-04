# Autonomous Workflows

[Human-in-the-loop workflows](05-HITL-WORKFLOWS.md) keep you at every step boundary: you approve the
spec, gate the plan, review each phase. This guide covers the opposite mode – **autonomous,
away-from-keyboard workflows** – where you hand the agent a goal and the guardrails, walk away,
and come back to finished work. You trade supervision for throughput: the agent no longer waits
for a prompt at every step, so the checkpoints you used to gate by hand must be replaced by checks
the agent can run itself.

Choose authority, trigger, worker count, hosting and limits separately. A read-only scheduled observer may have less authority than one local implementer. Grant only the authority the checks and task justify.

## Table of Contents

- [The contract: what must be true before you leave](#the-contract-what-must-be-true-before-you-leave)
- [The autonomy ladder](#the-autonomy-ladder)
  - [Capability check before a run](#capability-check-before-a-run)
  - [Goal-driven runs](#goal-driven-runs)
  - [Recurring loops](#recurring-loops)
  - [Orchestrators and subagents](#orchestrators-and-subagents)
  - [Always-on agents](#always-on-agents)
- [Bounded success and bounded failure](#bounded-success-and-bounded-failure)
- [Agents in CI](#agents-in-ci)
- [PR review bots](#pr-review-bots)
- [Hardening the harness](#hardening-the-harness)
- [The invariant, deferred](#the-invariant-deferred)
- [Conclusion](#conclusion)
- [Using this in the workshop](#using-this-in-the-workshop)

## The Contract: What Must Be True Before You Leave

Autonomous work only converges when the agent can tell whether it is done without you. Before any
unattended run, all three of these must hold:

- A **verifiable goal**: a definition of done the agent can check itself – a passing test suite, a
  green build, a clean lint, a script that exits zero. "Make it nicer" is not something an
  unattended run can verify.
- A **feedback signal inside the run**: the checks run after each iteration are what turn autonomous
  work from "keep editing" into "edit until correct." Without them the agent has nothing to converge
  on.
- **Guardrails**: the agent must not be able to do irreversible damage while you are away. Keep it
  on a branch or [worktree](05-HITL-WORKFLOWS.md#parallelizing-with-git-worktrees), deny push and
  destructive commands, constrain credentials, avoid production environment variables and services,
  and scope the task so a wrong turn stays contained.

If one of the three is missing, stay in the loop. The less verifiable the goal, the more an
autonomous run drifts – and you spend more time untangling an unsupervised diff than you would
have spent supervising it.

## The Autonomy Ladder

| Level                       | Use it for                                                 | Shape                                                                          |
| --------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Goal-driven run             | One bounded task with a checkable definition of done       | One agent iterates against the checks until the goal is met                    |
| Recurring loop              | Babysitting: CI runs, deploys, open PRs, flaky suites      | The same prompt re-runs on an interval or trigger until a condition holds      |
| Orchestrator with subagents | Work too big or too parallel for one context               | A lead agent decomposes the goal, fans out subagents, verifies and synthesizes |
| Always-on agent             | Standing duties that must not depend on you or your laptop | An agent runs 24/7 on a dedicated machine or server, picking up scheduled work |

The ladder is a memory aid for execution patterns, not a ranking of authority or maturity.
Record each dimension explicitly:

| Dimension | Choices                                                                | Decision to make                                     |
| --------- | ---------------------------------------------------------------------- | ---------------------------------------------------- |
| Authority | Observe; propose; edit bounded files; explicitly authorized Git writes | What may change before review?                       |
| Trigger   | One request; interval; external event                                  | What starts and stops the work?                      |
| Workers   | One agent; parallel readers; isolated implementers                     | Does the task actually decompose?                    |
| Hosting   | Local session; desktop scheduler; CI; dedicated host                   | What happens on sleep, restart or lost connectivity? |
| Limits    | Runtime, retries, token/spend budget, scope                            | Which mechanism enforces each limit?                 |

A local one-agent edit can be highly autonomous. Parallel read-only reviewers can remain closely
supervised. An always-on host is useful only when the duty requires it.

### Capability Check Before a Run

Checked against official documentation on 2026-09-05. Record the actual product, CLI/app/IDE,
version and model in WORKSHOP.md; do not infer app features from a CLI command or vice versa.

| Need                   | Claude Code                              | Codex                                                           |
| ---------------------- | ---------------------------------------- | --------------------------------------------------------------- |
| Bounded continued work | Goal support; inspect the installed help | Goal support where exposed by the installed CLI/app             |
| Recurring work         | /loop and scheduled prompts              | Scheduled tasks from Codex chats in the desktop app             |
| Scheduling UI in CLI   | Check installed commands                 | CLI does not provide the desktop Scheduled management interface |
| Local persistence      | Depends on session/host lifetime         | Local scheduled work requires the computer on and app running   |

Sources: [Claude scheduled prompts](https://code.claude.com/docs/en/scheduled-tasks),
[Claude goals](https://code.claude.com/docs/en/goal), and
[Codex scheduled tasks](https://learn.chatgpt.com/docs/automations?surface=app).
When a capability is unavailable, complete the bounded exercise as a normal agent run and record
that scheduling was not exercised. Do not invent a slash command.

### Goal-Driven Runs

One agent receives a goal and iterates without prompts between steps. Use the installed harness’s goal feature when available, or a normal bounded session. It implements, runs checks and stops at success, a limit or a blocker. Confirm the actual command in the capability check above.

The quality of the run is decided before it starts: the goal statement carries everything a
[prompt](03-PROMPTING.md) normally would – observation, goal, constraints, scope, and above all the
check. Pin down what the agent may touch and what "done" means, because nobody will be there to
correct course.

### Recurring Loops

Recurring work repeats a small check until a condition holds. Use the scheduling mechanism for your actual harness and surface. Keep unchanged state quiet, report meaningful changes, and stop at success, timeout or required user action. Test the prompt manually before scheduling it.

Loops are the right tool when the trigger is time or an external event rather than a diff. They
pair naturally with goal runs: a loop notices the broken build, a goal run fixes it.

### Orchestrators and Subagents

One agent context has limits: a bounded window, one working directory, one line of reasoning. For
work that is too big or too parallel for that – a migration across dozens of files, a review from
several independent perspectives, research that fans out across sources – use an **orchestrator**:
a lead agent that decomposes the goal, spawns subagents for the parts, and verifies and
synthesizes their results.

The pattern has three phases, and the middle one is embarrassingly parallel:

1. **Decompose** – the orchestrator turns the goal into independent work items.
2. **Fan out** – each work item goes to its own subagent with a self-contained prompt: parallel
   researchers, one implementer per [worktree](05-HITL-WORKFLOWS.md#parallelizing-with-git-worktrees),
   reviewers with different lenses.
3. **Verify and synthesize** – the orchestrator checks each result (ideally adversarially: a second
   subagent trying to refute the first) and merges what survives.

This buys wall-clock speed and fresh context per worker, and independent verification catches what
a single tired context misses. It costs tokens and produces more output to review, so reserve it
for work that genuinely decomposes – an orchestrator does not make a small sequential task faster.

### Always-On Agents

Local runs depend on the session or scheduler keeping its host available. A dedicated machine or managed runner can continue while your laptop sleeps; one-shot and recurring jobs can both use either hosting model.

Open-source systems have made this a weekend project rather than an infrastructure effort:

- [**OpenClaw**](https://openclaw.ai) – a personal AI assistant gateway that connects agents to
  WhatsApp, Telegram, Slack, and other messaging platforms, with cron jobs, reminders, and
  background tasks. The Mac mini setup is its signature deployment: silent, a few watts, always
  reachable from your phone.
- [**Hermes Agent**](https://github.com/NousResearch/hermes-agent) – Nous Research's self-hosted
  agent that runs recurring autonomous tasks on your own server, keeps persistent memory across
  runs, and writes its own reusable skills as it works.

If you would rather not own hardware, the same shape exists as managed services: cloud-hosted
agent runners, scheduled routines, or a plain CI schedule that launches an agent job. What matters
is the property, not the product: the work survives a closed terminal, a restart, and a sleeping
laptop.

Standing autonomy is standing risk, so the guardrails harden accordingly: give the machine its own
accounts and narrowly scoped credentials, keep it away from production secrets, cap what it can
spend, and keep an audit trail of what it did while you slept. An always-on agent is an employee
you never watch – onboard it like one.

## Bounded Success and Bounded Failure

Use the [autonomy exercise](labs/cases/autonomy/README.md). It has a solvable order-total defect,
a missing-business-rule case and a harmless boundary probe. Success on that path means a verified
repair within scope for Case 1 and an evidence-backed stop at the genuine blocker in Case 2.

Before leaving, record allowed files, immutable tests/check configuration, runtime and retry limits,
and the stop/report conditions. A prompt limit guides the agent; a host timeout or enforced budget
provides a stronger bound. Do not treat a spending alert as a hard cap.

For a loop, save its identity, interval, last-run evidence and stop condition. Cancel it after the
exercise and inspect the scheduler to confirm cancellation. A quiet loop can still be running.

## Agents in CI

The ladder so far runs on hardware you manage – your laptop on the lower rungs, your own server at
the top. The other natural home for autonomy is the **CI pipeline**, and in some ways it is the
better one: every job starts on a fresh, disposable runner with scoped credentials, and the
_code_ can only land as a commit or pull request. (Results are not the only thing that can leave
a runner – an agent with network access can also exfiltrate via requests, comments, logs, and
artifacts, which is what the hardening section below is about.) Protect your default branch so
that merging requires a human review, and the review invariant holds by construction – nothing
the agent does can _land_ anywhere you do not gate.

Three use cases carry most of the value:

- **Scheduled maintenance** – a nightly run triages dependency updates, sweeps for flaky tests, or
  reports what rotted since yesterday.
- **Issue-triggered implementation** – mention or label an issue and the agent picks it up,
  implements against the repository's checks, and opens a PR for review.
- **Fixing a red build** – a failing CI run triggers an agent that reads the logs, reproduces the
  failure, and opens a fix PR before you have seen the notification.

Start with a read-only reporting job. Manually dispatch it on a trusted revision, use
`contents: read` and checkout with `persist-credentials: false`, and retain the report as a job
artifact for a human. The [CI exercise](labs/cases/autonomy/ci-report.md) gives the first-stage
configuration and an authority comparison. Add branch-writing capability only after explicitly
defining the permitted Git actions and reviewing the first reports.

The following write-capable template requires reviewed action SHAs and provider setup before use.
It is not an installed workflow in this repository.

A _hardened_ GitHub Actions workflow for the mention-triggered variant – an issue comment is
untrusted input reaching an agent with repository credentials, so the trigger, the permissions,
and the action versions all need gates:

```yaml
name: claude
on:
  issue_comment:
    types: [created]

jobs:
  claude:
    # Gate the trigger: anyone can comment on a public issue, so require a
    # trusted author role before untrusted text reaches the agent.
    if: |
      contains(github.event.comment.body, '@claude') &&
      contains(fromJSON('["OWNER", "MEMBER", "COLLABORATOR"]'),
        github.event.comment.author_association)
    runs-on: ubuntu-latest
    timeout-minutes: 30 # bound a runaway run
    permissions:
      contents: write # push the working branch
      pull-requests: write # comment on PRs (opening the PR stays a human act)
      issues: write # reply on the issue
      id-token: write # the action's OIDC exchange for its GitHub App token;
      # drop only if you pass an explicit github_token instead.
    steps:
      # Pin actions to the full commit SHA of a release you reviewed - a
      # movable tag like @v1 is a supply-chain door into a privileged job.
      - uses: actions/checkout@<full-commit-sha> # vX.Y.Z
      - uses: pnpm/action-setup@<full-commit-sha> # vX.Y.Z
      - uses: actions/setup-node@<full-commit-sha> # vX.Y.Z
        with: { node-version: 24, cache: pnpm }
      # Give the agent its feedback loop: without installed dependencies it
      # cannot run the build/lint/test checks the contract relies on.
      - run: pnpm install --frozen-lockfile
      - uses: anthropics/claude-code-action@<full-commit-sha> # vX.Y.Z
        with:
          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
          # Bash is disabled by default - grant exactly the repo's checks,
          # or the agent has no feedback loop to converge on.
          claude_args: |
            --allowedTools "Bash(pnpm build:*),Bash(pnpm lint:*),Bash(pnpm exec prettier --check:*),Bash(pnpm test:*)"
```

Comment `@claude fix the failing order-total test` on an issue or PR, and the agent works on the
runner, runs the repo's checks, and pushes a working branch – by default it answers with a
prefilled link to open the pull request, so opening the PR stays a human act. The same shape
exists across the ecosystem – OpenAI Codex cloud tasks, GitLab Duo, or a self-rolled job that
runs any agent CLI headlessly.

Even hardened, keep three boundaries in mind. First, permission names are broader than your
intent: `contents: write` can push to any unprotected branch, not just the agent's working
branch – it is branch protection on the integration branch that keeps the human at the merge
gate, so verify it is on before enabling any agent trigger. Second, never combine privileged
secrets with workflows that run code from forked pull requests (`pull_request_target` plus a
checkout of the fork's ref is the classic mistake); an agent that builds untrusted code is
running untrusted code. Third, review protects _integration_, not _confidentiality_: by the time
you read the diff, a compromised run may already have exfiltrated what it could reach – which is
why egress limits, scoped short-lived credentials, and bounded tools come before review, not
instead of it. When in doubt, split the job in two – a read-only analysis job that untrusted
events may trigger, and a privileged write job that only trusted events reach.

Structurally, a CI job **is** a [goal-driven run](#goal-driven-runs), and the workflow file is
where the [contract](#the-contract-what-must-be-true-before-you-leave) lives: the trigger and its
prompt carry the goal statement, the pipeline's build, lint, and test stages are the feedback
signal, and the runner's permissions are the guardrails – versioned and reviewed like any other
code.

## PR Review Bots

The CI counterpart of [reviewing](04-REVIEWING.md): give every pull request an independent agent
review before a human looks at it. The framing from that guide does not change – a fast, talented,
occasionally overconfident colleague – what changes is that the colleague now shows up at the
merge gate automatically, on every PR, without being asked.

The field is crowded: `claude-code-action` in review mode (or a plain `@claude` review mention),
OpenAI Codex code review, GitHub Copilot code review, and CodeRabbit all comment directly on the
diff.

These bots read the repository's instruction files – `AGENTS.md`,
`.github/copilot-instructions.md` – so the [Lab 01](labs/01-setup.html) setup pays off a second
time: the repo is the prompt, for reviewers too. Conventions written down once now reach every
reviewer, human or not.

The rules of engagement mirror [acting on findings](04-REVIEWING.md#acting-on-findings):

- **Bots comment, humans merge.** A bot's approval is advisory; the merge button stays a human
  decision.
- **Verify findings before acting.** Open the file, read the line, reproduce the problem – bots
  produce confident false positives at scale, so the verify-before-acting discipline applies
  unchanged.
- **A quiet bot is not an approval.** No comments means the bot found nothing along the paths it
  looked, not that the change is correct.

## Hardening the Harness

The [contract](#the-contract-what-must-be-true-before-you-leave)'s guardrails are not aspirations
– they are tool configuration. Three mechanics carry most of the weight:

- **Permissions.** This repository reduces accidental secret reads in every session with
  `permissions.deny` in [`.claude/settings.json`](.claude/settings.json) and the `no-secrets`
  filesystem profile in [`.codex/config.toml`](.codex/config.toml). Their coverage differs (see
  [the setup notes](README.md#finish-the-ai-setup)): Claude Code's deny rules guard its built-in file
  tools but may not cover shell commands, while Codex applies an active filesystem profile across
  filesystem access, including shell commands. Neither mechanism is a complete security boundary.
  Unattended runs therefore need stronger layers: deny `git push`, destructive commands, and
  anything outside the task's scope, run inside the tool's sandbox or OS-level sandboxing, and keep
  real secrets out of the checkout entirely.
- **Prompt injection.** An agent that reads untrusted text – web pages, issue comments, MCP tool
  output – can be handed instructions by an attacker. Treat external content as data, never as
  commands, restrict network access for autonomous runs, and remember what the end-of-run diff
  review can and cannot do: it is your last gate before _integration_, but it cannot undo what a
  hijacked run already did – exfiltrated data, external API calls, posted comments, burned budget.
  Confidentiality is protected by isolation, egress limits, and scoped credentials, before review
  ever happens.
- **Vet MCP servers like you vet skills.** [02-SKILLS.md](02-SKILLS.md) scans third-party skills
  with SkillSpector before adopting them; apply the same skepticism to MCP servers. Prefer
  official ones, pin versions, and understand every tool a server exposes before registering it.

## The Invariant, Deferred

The [invariant](05-HITL-WORKFLOWS.md#the-workflow-invariant) is not waived, only deferred – and on
this rung it changes shape. A local goal-driven run can stop with an uncommitted diff; the human
stages and commits unless the current instruction explicitly authorizes more. A CI workflow may
authorize the agent to commit and push its own working branch, but that authority must be written
into the versioned workflow or goal – merely launching an autonomous run does not imply it. Any
authorization must name the allowed git actions and branch scope, and it must never include pushing
to a protected integration branch. Every level of the ladder still ends with human review – at the
end of the run, against the accumulated diff, at the commit or the merge gate rather than at each
step. Treat an autonomous run's output as a draft to review, never as already-approved work. The
same discipline from [`04-REVIEWING.md`](04-REVIEWING.md) applies: feedback loops first, an explicit
scope, two passes, verify findings before acting.

Autonomous runs pair naturally with
[worktrees](05-HITL-WORKFLOWS.md#parallelizing-with-git-worktrees): start one session per worktree and
several goals progress unattended in parallel. Keep concurrency modest, because those sessions
still share ports, caches, external services, API quotas, and your review capacity.

## Conclusion

Autonomy is the second dial, next to the [workflow pyramid](05-HITL-WORKFLOWS.md): the pyramid decides
how much structure the work gets, the ladder decides how closely you watch it. Climb the ladder
only as far as the goal is verifiable – a well-tested bugfix can run unattended overnight, while an
ambiguous design task still deserves a human at every boundary.

Reserve the mode for well-bounded, well-tested work, keep the guardrails on, and remember the
bookend that never moves: whatever ran while you were away, you still own the final judgment on
every diff.

## Using This in the Workshop

Work through [Lab 06 – Autonomous Workflows](labs/06-autonomous-workflows.html) after
[Lab 05 – Human-in-the-Loop Workflows](labs/05-hitl-workflows.html). Use the project you chose in
[Lab 00](labs/00-getting-started.html) for the required assignments whenever possible. Only fall
back to this repository when you do not have a suitable task in your own project.
