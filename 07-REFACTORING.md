# Refactoring Legacy Angular Towards a Modern, State-of-the-Art Codebase

A practical guideline for turning dusty, legacy Angular components into small, modern,
signal-based ones – **with the help of AI** – without losing control of the result. It is built
around a repeatable **7-step blueprint** and the [`ng-refactor`](.agents/skills/ng-refactor/SKILL.md)
agent skill that drives it. `ng-refactor` orchestrates the refactoring flow; Angular updates and
official migration schematics are handled through [`ng-migrate`](.agents/skills/ng-migrate/SKILL.md).

> The future is **agentic refactoring**: let AI do the hard work to improve and modernize your
> Angular workspaces – one small, verified step at a time. The architecture decisions stay human.

## Table of Contents

- [Live path and advanced path](#live-path-and-advanced-path)
- [Why refactor (and why it pays off with AI)](#why-refactor-and-why-it-pays-off-with-ai)
- [What "good" looks like – the target](#what-good-looks-like--the-target)
- [Before you start: guardrails & the gauntlet](#before-you-start-guardrails--the-gauntlet)
- [The 7-step blueprint](#the-7-step-blueprint)
  - [1. Analyse](#1-analyse)
  - [2. Declutter (Entschlacken)](#2-declutter-entschlacken)
  - [3. Update (NG Update)](#3-update-ng-update)
  - [4. Modernize (Modernisieren)](#4-modernize-modernisieren)
    - [Choose reactivity by responsibility](#choose-reactivity-by-responsibility)
  - [5. Type (Typisierung)](#5-type-typisierung)
  - [6. Refactor](#6-refactor)
  - [7. Review](#7-review)
- [Using the `ng-refactor` skill](#using-the-ng-refactor-skill)
- [A path from legacy to modern](#a-path-from-legacy-to-modern)
- [Hands-on lab](#hands-on-lab)
- [References](#references)

## Live path and advanced path

The [30-minute booking-summary exercise](labs/cases/refactoring/README.md) is the required live path.
It has six characterization tests and a small, behavior-preserving state refactor. Its explicit
synchronization debt is intentional teaching code. The full legacy table remains available for
the advanced seven-step exercise after class.

The live checkpoint is one verified, reviewed improvement. Completing a workspace upgrade and
a full table migration is the extended outcome, not the definition of completing the session.

## Why refactor (and why it pays off with AI)

Over the years, components collect features, special cases, and workarounds. Responsibilities
blur between UI, state, and business logic; readability drops and every change gets riskier;
teams get used to bad code instead of questioning it. Typical symptoms of a **dusty** component:

- Old Angular patterns that were never modernized (`*ngIf`, `@Input()`, `ngClass`, …).
- 400 to 800 (or more) lines of code in a single file.
- Many lifecycle hooks (`ngOnChanges`, …) and hard-to-trace side effects.
- Unclear symbol naming, AI-generated cruft, and missing structure.
- Complex view templates with too much logic, and unkempt stylesheets full of redundancy.

That costs you a high mental load on every change, error-prone edits and regressions, slow
development even with experienced teams, and difficult onboarding. **And it is not only expensive
for humans – bad code is harder for an AI agent to grasp, which produces more misunderstandings
and hallucinations.** Good names, small functions, and clear types reduce both. Clean code is the
prerequisite that lets AI accelerate the rebuild safely.

## What "good" looks like – the target

The goal is not "use AI"; it is a clear picture of a clean, modern Angular component, and a
repeatable way to get there:

- **Small, clearly focused components** with one recognizable main responsibility.
- **Signals, `computed()` state, and lean templates** replace implicit side effects.
- **Strict types** – no `any`; precise, well-named inputs and outputs.
- **Modern Angular** – `inject()`, standalone, native control flow, `OnPush`, zoneless.
- **Rules from the style guide, ESLint, and team conventions** make quality reproducible.

Reusable details for this target live in the skill's references:
[clean code & structure](.agents/skills/ng-refactor/references/clean-code-and-structure.md) and
[modern Angular](.agents/skills/ng-refactor/references/modern-angular.md).

## Before you start: guardrails & the gauntlet

These are what separate a safe refactoring from "AI slop". They hold for **every** step.

**AI guardrails**

- **Treat the agent like a junior.** Review every change before commit. A step is done when a
  human has read the diff – not because the agent said so.
- **No big-bang rewrite.** Only small, readable intermediate steps that can be reviewed and
  verified.
- **Every change must earn its keep** (_Umbau-Nutzen_): each edit delivers **less complexity**,
  **clearer responsibility**, or **modernization**. If it delivers none, don't make it.
- **Preserve meaning.** Never delete existing comments or domain logic; behavior-preserving
  refactors must not change behavior.
- **Plan first, then implement.** Ask the agent to plan and raise clarifying questions _before_
  it touches code – the interactive prompting level from [`03-PROMPTING.md`](03-PROMPTING.md).
- **Git discipline.** Start from a clean working tree, checkpoint after each step, and commit it
  yourself – the agent never stages or commits for you.

> **Pre-commit hook vs. red baseline.** This workspace's pre-commit hook runs `lint-staged`
> (`eslint --fix` + Prettier) on staged files. While a legacy file still carries lint errors, a
> checkpoint commit touching it will be partially auto-fixed and then **blocked** by the remaining
> errors. Commit early checkpoints with `git commit --no-verify` and let the hook take over again
> once the verification matrix is green.

**The verification matrix** – run every command independently after each step:

```bash
pnpm build
pnpm lint
pnpm exec prettier --check .
pnpm test --watch=false
```

These are non-mutating checks. Running them independently ensures a known-red lint baseline does
not suppress the formatting and test results. Use `pnpm lint --fix` or `pnpm format` deliberately
during an implementation step, then rerun the complete matrix. (`--watch=false` makes the test leg
terminate instead of entering vitest's interactive watch mode.)

On a normal project, do not proceed until the verification matrix is green. On a deliberately dusty fallback
such as this workspace, Analyse may reveal a red baseline because lint debt is the exercise and the
legacy table has no tests (the booking-summary exercise and the app shell do). Record those failures, add or restore a behavior safety net before production
refactoring, and make each later checkpoint either green or clearly no worse than the documented
baseline.

The intentional debt in this workspace is wider than lint: to host the legacy table, the app
deliberately runs **zone-based change detection** (the `zone.js` polyfill and
`provideZoneChangeDetection()` in `src/app/app.config.ts` – an explicit exception to
[`AGENTS.md`](AGENTS.md)'s zoneless rule) and carries **relaxed build budgets** in
`angular.json`. It also imports the commercially licensed `ag-grid-enterprise` package without a
licence key, so the `/table` demo prints AG Grid's licence warning and watermark – accepted for the
exercise, never for production – and keeps `useDefineForClassFields: false` in `tsconfig.json`,
carried over from the imported table's original configuration and revisited in the bonus round.
The legacy table components are explicitly pinned to
`ChangeDetectionStrategy.Eager` – the v22 name for the former default (CheckAlways) semantics,
and exactly what `ng update` pins on existing components so their behavior doesn't change (only
newly written components get the OnPush default). The exercise's core target is moving them to
`OnPush` – by deleting the `Eager` pin, not by writing `OnPush` explicitly, since it is the v22
default and the style guide says not to set it: a real behavioral change, because Eager components are checked on every zone tick
(the DOM only updates where bindings changed) while OnPush components are checked only after
signal changes, input changes, events, and explicit notifications such as `markForCheck` or
`AsyncPipe` – which is why the signal migration and this switch belong together. Restoring zoneless and tightening the budgets back towards the Angular defaults
(500 kB / 1 MB initial, 4 kB / 8 kB per-component styles) are the bonus round, not the core
definition of done: legacy code tends to lean on zone-driven timing – third-party libraries,
implicit `setTimeout` re-renders, tests that wait for the zone to settle – so the jump to
zoneless only becomes safe once every state change notifies Angular, which is what the signal
migration and OnPush deliver (OnPush is recommended for zoneless, not strictly required).

The linter is your checklist: it flags `max-lines: 400`, `complexity`,
`@typescript-eslint/no-explicit-any`, `explicit-function-return-type`, `sort-imports`,
`prefer-const`, and the Angular best-practice rules (`prefer-signals`, `prefer-standalone`,
`prefer-on-push-component-change-detection`, `prefer-control-flow`, `prefer-self-closing-tags`, …).
Several of these are error-level in this workspace, so `pnpm lint` exits red until the legacy table
is fixed (85 errors and 109 warnings at this commit) – the job is to drive both counts to zero,
comparing rules and locations against the recorded baseline rather than totals.

**Setup this assumes** is the agentic quality frame from
[Lab 01](labs/01-setup.html): Prettier + ESLint, an [`AGENTS.md`](AGENTS.md) with the project's
rules, the Angular MCP for current docs, and per-tool secret-deny rules (`.claude/settings.json`,
`.codex/config.toml`) that reduce accidental secret reads – a guard, not a security boundary; see
[Hardening the Harness](06-AUTONOMOUS-WORKFLOWS.md#hardening-the-harness). If any of these are missing, set them up first.

## The 7-step blueprint

The blueprint is a default order with explicit dependencies. Verify each checkpoint against the
recorded baseline. Update before adopting unavailable APIs; tighten boundary types before a migration
when those types are needed to preserve behavior. Record justified ordering changes in the plan.

| #   | Step                          | What it does                                                                |
| :-- | :---------------------------- | :-------------------------------------------------------------------------- |
| 1   | **Analyse**                   | Read the code, name the one responsibility, catalog symptoms, write a plan  |
| 2   | **Declutter** (Entschlacken)  | Delete dead code, unused members, redundant SCSS – pure subtraction         |
| 3   | **Update** (NG Update)        | Use ng-migrate to update Angular so modern APIs and migrations exist        |
| 4   | **Modernize** (Modernisieren) | Use ng-migrate for schematics; then replace hooks, OnPush (zoneless: bonus) |
| 5   | **Type** (Typisierung)        | Replace `any` with explicit types – the first lever in legacy code          |
| 6   | **Refactor**                  | Split functions, extract shared logic, enforce SRP, reorder members         |
| 7   | **Review**                    | Read top-to-bottom; confirm the gains; a human approves every change        |

The full, per-step reference (actions, prompt shapes, exit checks) is in
[`references/blueprint.md`](.agents/skills/ng-refactor/references/blueprint.md).

### 1. Analyse

Understand the component and write a plan – **change nothing yet**. Read the `.ts`, `.html`,
`.scss`, and existing specs or e2e tests together; name the single responsibility it should have; catalog the
symptoms (size, lifecycle hooks, `any`, old patterns, template logic, duplication, naming); and
map the contract (inputs, outputs, injected services, template bindings). Establish a **safety
net** – refactoring without tests is gambling, so confirm an existing behavior test or add one
before production edits. If build, lint, or test starts red, record the exact failures as the
baseline before making production changes.

_Exit check:_ a written plan, answered questions, a behavior safety net, and a baseline that is
green or explicitly documented as red before production code changed.

### 2. Declutter (Entschlacken)

Pure subtraction, lowest risk first. Delete dead code, unused imports and members, and
commented-out blocks – **but keep** meaningful comments and domain logic – and drop redundant SCSS.

_Exit check:_ only live code remains, behavior is unchanged, gauntlet green. A small, obviously
safe diff.

### 3. Update (NG Update)

A **workspace-level** step – run once, not per component. Bring Angular and dependencies up to
date so the modern APIs and migration schematics you need actually exist, and let the version's
automatic migrations run.

Delegate Angular package updates and automatic version migrations to
[`ng-migrate`](.agents/skills/ng-migrate/SKILL.md). In this blueprint, `ng-refactor` decides that
the workspace update belongs in the plan; `ng-migrate` owns the concrete update command, clean-tree
preflight, automatic migrations, gauntlet, and checkpoint.

Keep Angular current – at least twice a year for majors, ideally every couple of months for
minors – and address security while versions move (CSP, Trusted Types, and especially 3rd-party
packages).

_Exit check:_ Angular is current, automatic migrations applied and reviewed, gauntlet green.

### 4. Modernize (Modernisieren)

Adopt modern Angular. Prefer Angular's **official** migration schematics over hand-edits – they
rewrite deterministically and update every reference. Delegate them to the
[`ng-migrate`](.agents/skills/ng-migrate/SKILL.md) skill, **one migration per checkpoint**:
standalone, control flow (`@if` / `@for` / `@switch`), `inject()`, signal
`input()`/`output()`/queries, self-closing tags, `ngClass`/`ngStyle` → bindings, lazy routes,
unused-import cleanup.

Then do what the schematics don't:

- **Replace lifecycle hooks.** Move setup into field initializers / the `constructor`; use
  `takeUntilDestroyed()` for manual subscriptions; derive with `computed()` what `ngOnChanges` used
  to recompute; keep `effect()` and the render callbacks (`afterNextRender()`, `afterEveryRender()`,
  `afterRenderEffect()`) for synchronizing with imperative, non-reactive APIs in place of
  `ngAfterViewInit` – see the table below. Best of all: no hook.
- **OnPush** (zoneless as the bonus round), `computed()` for derived state, and signal-based data binding
  (`input` / `output` / `model`). Reach for `SignalStore` only when you genuinely need shared
  state, and use Signal Forms via [`ng-forms`](.agents/skills/ng-forms/SKILL.md).

_Exit check:_ chosen migrations applied (each gauntlet-green and checkpointed), no replaceable
lifecycle hooks remain, component is OnPush.

#### Choose reactivity by responsibility

| Existing responsibility                      | Candidate                                  | Evidence before replacing                             |
| -------------------------------------------- | ------------------------------------------ | ----------------------------------------------------- |
| Read-only value derived from state           | computed()                                 | Input changes and empty states still render correctly |
| Editable state with a changing source        | linkedSignal() when appropriate            | Reset and user-edit semantics are specified           |
| A user action                                | Event handler                              | Action runs once per interaction                      |
| Synchronize with an imperative widget        | effect() or an appropriate render callback | Readiness, timing and cleanup are covered             |
| React differently to previous/current values | Explicit transition logic                  | Previous-value behavior remains tested                |

Do not replace a hook with an effect solely to remove the hook. Angular recommends derived state
for derivations and effects for appropriate synchronization with non-reactive APIs.
See [Angular effects guidance](https://angular.dev/guide/signals/effect). The live exercise demonstrates
that modern syntax can still carry unnecessary synchronization.

### 5. Type (Typisierung)

Strict typing makes contracts explicit; move boundary typing earlier when a migration depends on it. Replace fuzzy types with explicit ones:
every return type and parameter type, `unknown` over `any`, `type` over `interface`. Extract
small, precisely-named types – each non-trivial one in its own file – and type inputs and outputs
precisely.

_Exit check:_ no `any` remains, zero `no-explicit-any` and `explicit-function-return-type`
warnings in the lint output, gauntlet green.

### 6. Refactor

Now the structural work, in small reviewable diffs:

- **Shrink functions.** Big event handlers mix validation, mapping, state update, and UI side
  effects. Describe the flow first, then cut it into small intent-revealing functions
  (`buildRequest`, `validateInput`, `updateSelection`).
- **DRY.** Lift shared logic into services, directives, pipes, utils, or sub-components.
- **Single Responsibility + Rule of One.** Split an oversized component into smaller focused ones;
  each thing gets its own file; keep each ≤ ~400 LoC.
- **Structure over chance.** Reorder members to the canonical order and keep the class readable
  top-to-bottom; thin the template (logic → `computed()`/methods, cyclomatic complexity ≤ 10);
  prefer `private`, `readonly`, `const`.

_Exit check:_ one responsibility per unit, no file > ~400 LoC, small named functions, a logic-light
template, each diff gauntlet-green and checkpointed.

Assess structural changes by ownership and the next likely edit. A 380-line component plus three
thin forwarding services can be harder to understand than one cohesive component. File size is a
house-style signal, not proof of better architecture. Explain which state or responsibility moved,
why the new owner is correct, and whether callers need fewer assumptions.

### 7. Review

Read the result top-to-bottom as if onboarding to it fresh. The general review practice – explicit
scopes, the two passes, verifying findings before acting – is covered in
[`04-REVIEWING.md`](04-REVIEWING.md), and the [`code-review`](.agents/skills/code-review/SKILL.md) skill
can dispatch an independent reviewer; this checklist adds the refactoring-specific gains check.
Confirm one clear responsibility and canonical member order; no `any`, small named functions, no
file > ~400 LoC, OnPush, no unexplained lifecycle or synchronization logic; comments and domain logic intact; tests
green **and still meaningful**; and that each change delivered a real gain. Summarize what changed
and **why**, note follow-ups, and – for a large scope – hand off to
[`ng-review-architecture`](.agents/skills/ng-review-architecture/SKILL.md).

_Exit check:_ a human has reviewed the full diff, the gauntlet is green, the gains are written
down, and the change is committed by you.

## Using the `ng-refactor` skill

The blueprint above is encoded as the [`ng-refactor`](.agents/skills/ng-refactor/SKILL.md) agent
skill, so your AI agent can drive it for you. Start each step by pointing the agent at the skill
and the file, and let it plan before it edits:

```text
Follow the ng-refactor skill. We're on step N (<name>) for <path/to/component>.
Plan it, ask me anything unclear, then implement – small diffs only.
```

The skill ships three references the agent (and you) can lean on:

- [`blueprint.md`](.agents/skills/ng-refactor/references/blueprint.md) – the 7 steps in depth,
  with per-step prompts and exit checks.
- [`clean-code-and-structure.md`](.agents/skills/ng-refactor/references/clean-code-and-structure.md)
  – naming, KISS/DRY, Single Responsibility, the canonical member ordering, and a before/after
  example.
- [`modern-angular.md`](.agents/skills/ng-refactor/references/modern-angular.md) – the
  modern-Angular API mapping, the migration list, the Angular ESLint best-practice rules, and
  updates/security.

It **pairs with** [`ng-migrate`](.agents/skills/ng-migrate/SKILL.md) (Angular updates in step 3
and official schematics in step 4), [`ng-review-architecture`](.agents/skills/ng-review-architecture/SKILL.md) (deeper
review in steps 1 and 7), [`create-e2e-tests`](.agents/skills/create-e2e-tests/SKILL.md) (the
safety net in step 1), and the focused passes
[`ng-forms`](.agents/skills/ng-forms/SKILL.md),
[`ng-security`](.agents/skills/ng-security/SKILL.md),
[`ng-performance`](.agents/skills/ng-performance/SKILL.md), and
[`ng-accessibility`](.agents/skills/ng-accessibility/SKILL.md). See [`02-SKILLS.md`](02-SKILLS.md) for
the full directory.

## A path from legacy to modern

For a whole legacy codebase, apply the blueprint at two altitudes – **once for the workspace, then
in a loop for each component** – and keep every change small and reviewed.

1. **Get the quality frame in place** (once). Prettier, ESLint with the modern Angular rules,
   `AGENTS.md`, the Angular MCP, and the secret-deny rules – reproduce them via [Lab 01](labs/01-setup.html).
   Without the gauntlet and the linter-as-checklist, the rest is unsafe.
2. **Update the workspace** (once – blueprint step 3). Use
   [`ng-migrate`](.agents/skills/ng-migrate/SKILL.md) to bring Angular and dependencies current and
   run the automatic migrations before touching individual components, so modern APIs exist.
3. **Pick a target and a safety net.** Start with a high-value, high-pain component. Add a
   behavior (e2e) test first so you can refactor fearlessly.
4. **Run the per-component loop** – steps 1, 2, 4, 5, 6, 7 – one component at a time, committing
   at every green checkpoint. Resist batching; small diffs are the whole point.
5. **Scale out.** Repeat component by component. Let the workspace-level migrations (step 3) ride
   along on each Angular update so the codebase keeps drifting towards modern instead of away from
   it.

Treat the agent's output like a junior's work throughout: review before each commit, and only keep
changes that reduce complexity, clarify responsibility, or modernize.

## Hands-on lab

Work the blueprint end-to-end on a real component in
[Lab 07 – Refactoring a Dusty Angular Component](labs/07-refactoring.html). Run the required
30-minute [booking-summary exercise](labs/cases/refactoring/README.md) first, then continue with a dusty
component in your own project from [Lab 00](labs/00-getting-started.html). If you do not have a
legacy codebase available, use this workspace's `src/app/components/table/` feature or the
deliberately dusty example component at
[`L-X-T/ng-days-refactoring-ai`](https://github.com/L-X-T/ng-days-refactoring-ai).

## References

- Skill: [`ng-refactor`](.agents/skills/ng-refactor/SKILL.md) ·
  [SKILL.md](.agents/skills/ng-refactor/SKILL.md) ·
  [references](.agents/skills/ng-refactor/references/blueprint.md)
- Related skills: [`ng-migrate`](.agents/skills/ng-migrate/SKILL.md) · all skills in
  [`02-SKILLS.md`](02-SKILLS.md)
- Project conventions: [`AGENTS.md`](AGENTS.md) ·
  [Angular Coding Style Guide](style-guide/style-guide.md)
- Official Angular guidance:
  [angular.dev/style-guide](https://angular.dev/style-guide) ·
  [angular.dev/reference/migrations](https://angular.dev/reference/migrations)
- Origin: Alexander Thalhammer's workshop _"Refactoring verstaubter Angular-Komponenten (mithilfe
  von KI)"_ (JavaScript & Angular Days).
