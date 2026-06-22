# Skills

Agent skills for this repository live under `.agents/skills/`. Each skill folder contains a
`SKILL.md` plus optional `references/`, `scripts/`, or `assets/` support files loaded just in time.
They fall into two groups: **third-party skills** copied or adapted from public sources, and
**custom skills** authored in this repository.

Work through [Lab 02 – Agent Skills](labs/02-skills.html) to try a few skills on your own project
and author one custom skill.

To keep this index honest, run the
[`update-skills-directory`](.agents/skills/update-skills-directory/SKILL.md) skill whenever a
skill is added, renamed, or removed – it verifies skill frontmatter, support-file structure, and
links from this index.

## Why skills keep your context clean

Reaching for a task-specific skill instead of loading everything from `AGENTS.md` is one of the
most important things you can do for output quality. `AGENTS.md` is always in context, so every
piece of general guidance it carries crowds the window with instructions irrelevant to the task at
hand. A skill is pulled in only when the task calls for it, keeping that guidance out of context
until it matters.

That keeps the working context lean and focused – and a lean, focused context is exactly what gets
good results out of an LLM. A bloated context dilutes attention, buries the relevant instructions,
and degrades the quality of the answer. So prefer a narrow skill for a specific job over piling
more general rules into `AGENTS.md`.

## Third-party skills

Copied or adapted from public sources; the origin column records where each skill came from.

| Skill                                                          | What it does                                                                                           | Origin                                                        |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------- |
| [angular-developer](.agents/skills/angular-developer/SKILL.md) | Generates Angular code and architectural guidance, version-aware, with a `ng build` verification loop. | [`angular/skills`](https://github.com/angular/skills)         |
| [brainstorming](.agents/skills/brainstorming/SKILL.md)         | Design-first gate: turn an idea into an approved spec before any code is written.                      | [`obra/superpowers`](https://github.com/obra/superpowers)     |
| [grill-me](.agents/skills/grill-me/SKILL.md)                   | Interrogates a plan one question at a time to stress-test it before building.                          | [`mattpocock/skills`](https://github.com/mattpocock/skills)   |
| [spartan](.agents/skills/spartan/SKILL.md)                     | Works with spartan/ui (Brain + Helm) via the `@spartan-ng/cli` generators.                             | [`spartan-ng/spartan`](https://github.com/spartan-ng/spartan) |

### Scanning skills for vulnerabilities

Skills are executable instructions, so a third-party skill is as risky as any dependency you
pull in. [NVIDIA SkillSpector](https://github.com/NVIDIA/SkillSpector) is an open-source
(Apache 2.0) security scanner built for exactly this: point it at a skill – a git repo, URL, zip,
directory, or single file – and it flags vulnerabilities, malicious patterns, and security risks
before you install it. It checks 64 patterns across 16 categories (prompt injection, data
exfiltration, privilege escalation, supply chain, excessive agency, system-prompt leakage, MCP
tool poisoning, and more), combining fast static analysis with optional LLM semantic analysis and
live CVE lookups, and emits terminal, JSON, Markdown, or SARIF reports plus a 0–100 risk score.

Use it to vet any third-party skill before adopting it here. See the
[scanning guide](https://docs.nvidia.com/skills/scanning-agent-skills) for the workflow.

## Custom skills

Authored in this repository; each row summarizes what the skill does and links to its `SKILL.md`.

| Skill                                                                      | What it does                                                                                                |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| [code-review](.agents/skills/code-review/SKILL.md)                         | Reviews current, staged, last-commit, and merge or PR work against requirements and the style guide.        |
| [create-a-skill](.agents/skills/create-a-skill/SKILL.md)                   | Meta-skill for authoring, editing, and improving agent skills.                                              |
| [create-e2e-tests](.agents/skills/create-e2e-tests/SKILL.md)               | Writes a behaviour-level e2e test for an Angular component (Playwright or Cypress).                         |
| [git-stack-rewrite](.agents/skills/git-stack-rewrite/SKILL.md)             | Folds a change into an older commit and rebases the dependent branch stacks.                                |
| [grill-with-style](.agents/skills/grill-with-style/SKILL.md)               | Grilling session aware of this project's domain model and style guide.                                      |
| [handover](.agents/skills/handover/SKILL.md)                               | Compacts the conversation into a handoff document for the next agent.                                       |
| [ng-accessibility](.agents/skills/ng-accessibility/SKILL.md)               | Makes Angular apps accessible – semantic HTML, keyboard/focus, ARIA, CDK a11y, router & forms, WCAG AA.     |
| [ng-forms](.agents/skills/ng-forms/SKILL.md)                               | Builds signal-based forms with Angular's Signal Forms API (v22+).                                           |
| [ng-migrate](.agents/skills/ng-migrate/SKILL.md)                           | Runs Angular updates and official migration schematics, one verified checkpoint at a time.                  |
| [ng-performance](.agents/skills/ng-performance/SKILL.md)                   | Optimizes Angular initial-load and runtime performance (bundles, lazy loading, change detection, zoneless). |
| [ng-prototype](.agents/skills/ng-prototype/SKILL.md)                       | Builds a throwaway Angular prototype (terminal logic or UI variations) to answer a design question.         |
| [ng-review-architecture](.agents/skills/ng-review-architecture/SKILL.md)   | Reviews Angular architecture against DDD and module depth.                                                  |
| [ng-review-style-guide](.agents/skills/ng-review-style-guide/SKILL.md)     | Audits the whole codebase against every project style guide, severity-ranked, then fixes on approval.       |
| [ng-security](.agents/skills/ng-security/SKILL.md)                         | Hardens Angular apps: sanitization/XSS, CSP & Trusted Types, HttpClient XSRF, auth, SSR/SSRF, dependencies. |
| [ng-styling](.agents/skills/ng-styling/SKILL.md)                           | Audits Angular styling (SCSS, bindings, encapsulation, tokens, frameworks) against three style guides.      |
| [update-skills-directory](.agents/skills/update-skills-directory/SKILL.md) | Audits the skills directory so every skill is structured correctly and linked here.                         |
