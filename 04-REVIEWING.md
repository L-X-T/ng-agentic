# Reviewing

Every piece of agentic work ends with review. The agent can prepare the diff, explain the
tradeoffs, and even review its own output – but the human owns the final judgment. Review is
where agentic speed either becomes shipped quality or becomes shipped regressions; it is the
one step you never delegate away.

This guide covers how to review agent work in practice: letting the feedback loops go first,
picking an explicit scope, running the two review passes, using the
[`code-review`](.agents/skills/code-review/SKILL.md) skill for an independent second opinion,
and acting on findings without rubber-stamping them.

## Table of Contents

- [The review invariant](#the-review-invariant)
- [Let the machines go first](#let-the-machines-go-first)
- [Pick an explicit scope](#pick-an-explicit-scope)
- [Practice with a known result](#practice-with-a-known-result)
- [The two passes](#the-two-passes)
- [Reviewing with an agent](#reviewing-with-an-agent)
- [Acting on findings](#acting-on-findings)
- [Review early, review often](#review-early-review-often)
- [Using this in the workshop](#using-this-in-the-workshop)

## The Review Invariant

Treat every agent diff as a draft from a fast, talented, occasionally overconfident colleague –
never as already-approved work. Three rules follow:

- **The human in the loop commits – my default.** I personally like to stage and commit myself
  as the human in the loop; others validly let their agents work more autonomously – how much
  autonomy to grant is the topic of the workflow chapters right after this one
  ([`05-HITL-WORKFLOWS.md`](05-HITL-WORKFLOWS.md), then `06-AUTONOMOUS-WORKFLOWS.md`).
- **Review at each boundary.** For phased work, review and commit at each phase boundary, not
  one large commit at the end. Ten small reviewed diffs beat one thousand-line archaeology dig.
- **No diff is too simple.** The five-minute change that "obviously works" is exactly the one
  that ships with the silent API break.

## Let the Machines Go First

Your attention is the scarcest resource in the loop, so never spend it on problems a machine
finds for free. Before any human or agent review, run the feedback loops from this workspace's
setup:

```bash
pnpm workshop:check
```

The [verification contract](VERIFICATION.md) defines independent, non-mutating checks and the report.
Repair source during implementation, then verify the final state. A known-red exercise baseline must
be recorded and compared by diagnostics; it does not suppress other checks. Add requirement-specific
behavior tests or observations. When those checks are accounted for, review intent, correctness and design.

## Pick an Explicit Scope

"Review this" invites the agent to guess what "this" is. The
[`code-review`](.agents/skills/code-review/SKILL.md) skill defines four scopes – choose exactly
one before gathering context:

| Scope             | Use when                                       | Inspect with                     |
| ----------------- | ---------------------------------------------- | -------------------------------- |
| Current work      | Reviewing unstaged changes and untracked files | `git status --short`, `git diff` |
| Staged work       | Reviewing only what is ready to commit         | `git diff --cached`              |
| Last commit       | Reviewing exactly the previous commit          | `git show HEAD`                  |
| Merge or PR range | Reviewing branch work against a base           | `git diff <merge-base>..HEAD`    |

Making the scope explicit is what turns "looks fine" into a review with a defined subject – you
know precisely which lines were judged and which were not.

For a PR, compute `git merge-base HEAD <target>` first and use the resulting SHA as the base.
Read untracked files explicitly; `git diff` does not include them. Record the base/head and whether
working-tree changes are included. Re-read the final diff after any repair.

## Practice with a Known Result

Use the [prepared review case](labs/cases/review/requirements.md) when you do not have a useful diff.
Read its requirements and compare the before/after files without consulting the facilitator key.
Write your concerns before running the independent reviewer. Then classify each finding as confirmed,
rejected with evidence, or uncertain. Count confirmed defects, misses and false positives.

A severity label must follow impact. Reproducing a bug confirms its existence; it does not
automatically make the bug Critical.

## The Two Passes

Every review has two passes, in this order:

1. **Correctness against the requirements.** Does the change do what was asked – the goal from
   the prompt, the decisions from the grilling session, the spec if there is one? Look for
   missing edge cases, silent behavior changes, and work the agent did that nobody asked for.
2. **Style-guide conformance.** For each touched file type, check the matching guide from
   [`style-guide/style-guide.md`](style-guide/style-guide.md) – TypeScript, templates, SCSS,
   accessibility, tests, npm, Markdown, or git. Conventions reviewed once per diff stay
   conventions; conventions reviewed never become archaeology.

The order matters: a beautifully conventional change that solves the wrong problem is still
wrong, so correctness earns the first pass.

## Reviewing with an Agent

A second pair of eyes is valuable precisely because it did not write the code – so give the
reviewing agent **independence**. The [`code-review`](.agents/skills/code-review/SKILL.md) skill
dispatches a read-only reviewer subagent with a fresh context: it receives the description,
requirements, verification state, review scope, and diff commands, and returns findings ranked
Critical / Important / Minor. If your agent cannot dispatch subagents, the skill runs the same
read-only review template in-session and says so – you lose some independence, not the review. An agent reviewing its own work in the same session is grading its
own homework; a fresh context breaks the shared assumptions.

For deeper, more specialized passes, this workspace also ships:

- [`ng-review-architecture`](.agents/skills/ng-review-architecture/SKILL.md) – reviews the
  architecture against DDD boundaries and module depth.
- [`ng-review-style-guide`](.agents/skills/ng-review-style-guide/SKILL.md) – audits the whole
  codebase against the project style guides, auto-selected by touched file type, severity-ranked.

Agent reviewers change the economics of reviewing – a thorough pass costs minutes, so it can run
after every task instead of once per release. What they do not change is ownership: their
findings are input to _your_ judgment, not a verdict.

## Acting on Findings

Reviewer findings – human or agent – are claims, not facts. Agents in particular produce
confident false positives, so:

- **Verify every finding against the codebase before editing.** Open the file, read the line,
  reproduce the problem. Never fix what you have not confirmed.
- **Rank and act by severity.** Fix valid **Critical** issues immediately, fix valid
  **Important** issues before proceeding, note **Minor** issues for later instead of letting
  them stall the work.
- **Push back with evidence.** Rejecting a finding requires file/line evidence or test output –
  "it seems fine" is not a rebuttal, in either direction.
- **Close the loop.** After fixing, re-run the feedback loops and re-review the changed portion.
  A fix applied under review pressure is a fresh, unreviewed change.

## Review Early, Review Often

Review is cheapest at the moment a change is small and its intent is fresh:

- **After each task** in agent-driven development – catch issues before they compound into the
  next task's foundation.
- **Before every merge or PR** – the last gate where a problem is still private.
- **When stuck** – a review of the work so far often finds the wrong assumption faster than more
  implementation does.

If a diff has grown too large to review with attention, that is not a reviewing problem – it is
a workflow problem. Split the work into phases and review at each boundary.

## Using This in the Workshop

Work through [Lab 04 – Reviewing](labs/04-reviewing.html) after the prompting lab. Bring real
work in progress from your own project if you have it – reviews of work you care about teach
more than reviews of exercises.
