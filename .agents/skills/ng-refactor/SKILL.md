---
name: ng-refactor
description: Refactor a dusty / legacy Angular component into a small, modern, signal-based one using a repeatable 7-step blueprint – Analyse → Declutter → Update → Modernize → Type → Refactor → Review – while delegating Angular updates and official migration schematics to ng-migrate. Use when the user wants to refactor, modernize, clean up, tame, or "de-dust" a large, messy, or legacy Angular component, service, directive, or feature.
license: MIT
metadata:
  author: Alexander Thalhammer
  version: '1.0'
---

# ng-refactor

Over years, Angular components accumulate features, special cases, and workarounds until
responsibilities blur between UI, state, and business logic — `any` spreads, lifecycle hooks
multiply, templates fill with logic, and files cross 400, 600, 800 lines. Such "dusty"
components carry a high mental load, make every change risky, and are **harder for an AI agent
to grasp** than for a human. Clean names, small functions, and precise types reduce both
misunderstandings and hallucinations.

This skill modernizes one component (or a small set) at a time through a **repeatable
blueprint** of seven steps, each over a chosen **scope**, each verified by the full **gauntlet**
and paused at a clean **checkpoint** for human review before the next. AI accelerates the
rebuild; **the architecture decisions stay human.**

`ng-refactor` orchestrates the seven-step refactoring flow. For Angular version updates,
automatic update migrations, and official `@angular/core` migration schematics, invoke
[ng-migrate](../ng-migrate/SKILL.md) from the relevant step and let that skill own the migration
workflow.

## The blueprint — 7 steps

| #   | Step                          | What it does                                                               |
| :-- | :---------------------------- | :------------------------------------------------------------------------- |
| 1   | **Analyse**                   | Read the code, name the one responsibility, catalog symptoms, write a plan |
| 2   | **Declutter** (Entschlacken)  | Delete dead code, unused members, redundant SCSS — pure subtraction        |
| 3   | **Update** (NG Update)        | Delegate Angular updates to ng-migrate so modern APIs and migrations exist |
| 4   | **Modernize** (Modernisieren) | Delegate official schematics; replace lifecycle hooks; OnPush + zoneless   |
| 5   | **Type** (Typisierung)        | Replace `any` with explicit types — the first lever in legacy code         |
| 6   | **Refactor**                  | Split functions, extract shared logic, enforce SRP, reorder members        |
| 7   | **Review**                    | Read top-to-bottom; confirm the gains; human approves every change         |

Steps 3–6 stack: each assumes the previous ran. Declutter before you update, update before you
modernize (you need the new APIs), type before you refactor (types make the cut safe). Full
details, per-step prompts, and checklists live in [references/blueprint.md](references/blueprint.md).

## Guardrails (non-negotiable)

These hold for **every** step. They are what separate a safe refactoring from "AI slop".

- **Treat the agent like a junior.** Review every change before commit. No step is "done"
  because the agent said so — it is done when a human has read the diff.
- **No big-bang rewrite.** Only small, readable intermediate steps that can be reviewed and
  verified. Never replace a whole component in one unreadable diff.
- **Every change must earn its keep** (_Umbau-Nutzen_): each edit must deliver **less
  complexity**, **clearer responsibility**, or **modernization**. If it delivers none, don't
  make it.
- **Preserve meaning.** Do not delete existing comments or domain logic. Behavior-preserving
  refactors must not change behavior — only structure, names, and types.
- **Plan first, then implement** (the prompting order from the workshop): in Step 1 produce a
  plan and ask clarifying questions _before_ touching code.
- **Git discipline.** Start from a clean working tree; checkpoint after each step. **Never**
  stage, commit, or push on the user's behalf — surface the diff and let them commit.

## The gauntlet

After every step, run all four in order on the result, and do not proceed until green:

**build → lint (`--fix`) → format → test**

Resolve concrete commands from `package.json` scripts (this workspace: `pnpm build`,
`pnpm lint` — add `--fix` via `ng lint --fix`, `pnpm format`, `pnpm test`). The linter is your
checklist: it enforces `max-lines: 400`, `complexity`, `@typescript-eslint/no-explicit-any`,
`explicit-function-return-type`, `sort-imports`, `prefer-const`, and the Angular best-practice
rules (`prefer-signals`, `prefer-standalone`, `prefer-on-push-component-change-detection`,
`prefer-control-flow`, `prefer-self-closing-tags`, …). A step that is "done" but red is not done.

## Workflow

### 1. Analyse

Do not change code yet. Read the component `.ts`, its template `.html`, styles `.scss`, and spec.

- **Name the single responsibility** the component _should_ have. Everything that doesn't serve
  it is a candidate to extract or remove.
- **Catalog the symptoms**: LoC; lifecycle hooks (`ngOnInit`, `ngOnChanges`, …) and implicit
  side effects; `any` / weak types; old patterns (`*ngIf`, `@Input()`, `@Output()`, `ngClass`,
  `ngStyle`); template logic; duplication; unclear names.
- **Map the contract**: inputs, outputs, injected services, and what the template binds to.
- **Establish a safety net.** Confirm behavior is covered by tests (e2e is best — see
  [create-e2e-tests](../create-e2e-tests/SKILL.md)). If coverage is thin, add a
  characterization test _before_ refactoring. Run the gauntlet to get a green baseline.
- **Write the plan** — ordered steps, expected wins, risks — and **ask clarifying questions**.

_Done when_ you hold a written plan, a green baseline, and a behavior safety net; the user has
answered open questions. No production code changed.

### 2. Declutter (Entschlacken)

Pure subtraction, lowest risk first. Delete dead code, unused imports/members/inputs,
commented-out blocks (but **keep** meaningful comments and domain logic), and redundant SCSS.

_Done when_ only live code remains, behavior is unchanged, and the gauntlet is green.

### 3. Update (NG Update)

A workspace-level step — do it once, not per component. Bring Angular and dependencies up to
date so the modern APIs and migration schematics you need actually exist.

- Delegate Angular package updates and automatic version migrations to
  [ng-migrate](../ng-migrate/SKILL.md). `ng-refactor` decides when the update belongs in the
  refactoring plan; `ng-migrate` owns the update command, clean-tree preflight, automatic
  migrations, gauntlet, and checkpoint.
- Bring non-Angular npm packages along deliberately when the refactoring plan requires it.
- Address security while versions move: CSP, Trusted Types, and especially 3rd-party packages.

See [references/modern-angular.md](references/modern-angular.md#updates--security) for cadence and
the automatic-migration list.

_Done when_ Angular is current, automatic migrations have run, and the gauntlet is green.

### 4. Modernize (Modernisieren)

Apply Angular's **official** migration schematics and modern APIs. Delegate the schematics to
[ng-migrate](../ng-migrate/SKILL.md) – one migration per checkpoint: standalone, control flow,
`inject()`, signal `input()`/`output()`/queries, self-closing tags, `ngClass`/`ngStyle` →
bindings, lazy routes, unused-import cleanup.

Then do the modernization the schematics don't cover:

- **Replace lifecycle hooks.** Move setup into the field initializer / `constructor`; use
  `takeUntilDestroyed()` for manual subscriptions; use `effect()`, `afterNextRender()`,
  `afterEveryRender()`, `afterRenderEffect()` instead of `ngAfterViewInit` / `ngOnChanges`.
  Better still: no lifecycle hook at all.
- **OnPush + zoneless**, `computed()` over manually-maintained derived state, signal-based
  data binding (`input`/`output`/`model`). `SignalStore` only if you truly need it; Signal
  Forms via [ng-forms](../ng-forms/SKILL.md).

Mapping table and rule-by-rule guidance: [references/modern-angular.md](references/modern-angular.md).

_Done when_ the chosen migrations are applied (each gauntlet-green and checkpointed), no
lifecycle hooks remain that signals/render hooks can replace, and the component is OnPush.

### 5. Type (Typisierung)

Strict typing is **the first lever** in legacy code. Replace fuzzy types with explicit ones:

- Every return type and parameter type. "Everything has a type."
- Prefer `unknown` over `any`; prefer `type` over `interface`.
- Extract small, precisely-named types — each non-trivial one in its own file
  (_Rule of One_). Precisely typed in-/outputs make the component readable.

_Done when_ no `any` remains, `no-explicit-any` and `explicit-function-return-type` are clean,
and the gauntlet is green.

### 6. Refactor

Now the structural work, in small reviewable diffs:

- **Shrink functions.** Big event handlers mix validation, mapping, state update, and UI side
  effects. Describe the flow first, then cut it into small, intent-revealing functions
  (`buildRequest`, `validateInput`, `updateSelection`).
- **DRY.** Lift shared logic into services, directives, pipes, utils, or sub-components.
- **SRP + Rule of One.** Split an oversized component into smaller focused ones, each in its own
  file, each ≤ ~400 LoC.
- **Reorder members** to the canonical structure and keep the class readable top-to-bottom.
- **Simplify the template** — move logic into `computed()`/methods, respect cyclomatic
  complexity ≤ 10.
- Prefer `private`, `readonly`, `const`.

Member ordering, naming rules, and the extraction patterns: [references/clean-code-and-structure.md](references/clean-code-and-structure.md).

_Done when_ each unit has one responsibility, no file exceeds ~400 LoC, functions are small and
named, the template is logic-light, and every diff was gauntlet-green and checkpointed.

### 7. Review

Read the result top-to-bottom as if onboarding to it fresh. Confirm:

- One clear responsibility; canonical member order; reads top-to-bottom.
- No `any`; small named functions; no file > ~400 LoC; OnPush; no leftover lifecycle hooks.
- Comments and domain logic intact; tests still green **and still meaningful**.
- Each change delivered a real gain (less complexity / clearer responsibility / modern).

Summarize what changed and **why** (the _Umbau-Nutzen_) and list follow-ups. For a deeper
architectural pass on a large scope, hand off to
[ng-review-architecture](../ng-review-architecture/SKILL.md). The **human approves every change
before commit** — this skill never commits for you.

_Done when_ the human has reviewed the full diff, the gauntlet is green, and the gains are
written down.

## Setup this skill assumes

The workshop's guardrails make AI refactoring reproducible — they should already be in place
(see [Lab 01](../../../labs/01-setup.html)): **Prettier** + **ESLint** (the shared quality
frame), an **`AGENTS.md`** with the project's rules, the **Angular MCP** for current docs, and
an **`.aiignore`** so the agent never reads what it shouldn't. If they're missing, set them up
first — the gauntlet and the linter-as-checklist depend on them.

## Pairs with

- [ng-migrate](../ng-migrate/SKILL.md) – owns Angular package updates, automatic update
  migrations, and official `@angular/core` migration schematics for Steps 3 and 4.
- [ng-review-architecture](../ng-review-architecture/SKILL.md) — deeper review in Steps 1 & 7.
- [ng-forms](../ng-forms/SKILL.md) · [ng-security](../ng-security/SKILL.md) ·
  [ng-performance](../ng-performance/SKILL.md) · [ng-accessibility](../ng-accessibility/SKILL.md)
  — focused passes when a refactoring touches forms, security, performance, or a11y.
- [create-e2e-tests](../create-e2e-tests/SKILL.md) — build the safety net in Step 1.
