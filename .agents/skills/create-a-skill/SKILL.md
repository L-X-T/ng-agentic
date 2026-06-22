---
name: create-a-skill
description: Create, edit, and improve agent skills with the right invocation, information hierarchy, leading words, and pruning so each skill runs predictably. Use when the user wants to create, write, edit, refactor, or review a skill, or asks what makes a skill good.
license: MIT
metadata:
  author: Alexander Thalhammer
  version: '1.0'
---

# Create a skill

A skill exists to wrangle determinism out of a stochastic system. **Predictability** — the agent taking the same _process_ every run, not producing the same output — is the root virtue; every decision below serves it.

**Bold terms** are defined in [`references/glossary.md`](references/glossary.md); look them up there for the full meaning. When writing the skill's Markdown, follow `style-guide/style-guide.md` and `style-guide/style-guide.md.md`. If the skill will produce code, docs, package, or Git output, point it at the relevant `style-guide/` file rather than restating that guide.

## Process

### 1. Gather

Establish what the skill must do before shaping it. Ask the user:

- What task or domain does it cover?
- What are the distinct **branches** — the separate use cases a run might take?
- Does it need deterministic scripts, or just instructions?
- What reference material already exists to fold in or point at?

_Done when_ you can name the skill's branches and say whether it carries **steps**, **reference**, or both.

### 2. Shape

Make the two structural calls before writing a line of body:

- **Model-invoked** vs **user-invoked**: keep a **description** (so the agent — or another skill — can fire it autonomously, paying permanent **context load**) only when something other than the human must reach it. Otherwise set `disable-model-invocation: true` for zero context load, with the human as the index. When user-invoked skills outgrow memory, gather them under a **router skill**.
- **Information hierarchy**: rank every piece by how immediately the agent needs it — **steps** (in-file, primary) → in-file **reference** → disclosed reference behind a **context pointer**. Inline what every branch needs; **progressively disclose** what only some branches reach. Keep a concept's definition, rules, and caveats **co-located** under one heading.

_Done when_ invocation is chosen with a reason and each piece of content has a rung.

### 3. Draft

Create the folder and write the content to the shape from step 2:

```
skill-name/
├── SKILL.md          # required – metadata plus lean core instructions
├── references/       # optional – one-level-deep context loaded just in time
├── scripts/          # optional – tiny deterministic CLIs
└── assets/           # optional – templates or static output material
```

```md
---
name: skill-name
description: <what it does>. Use when <one trigger per branch>. # omit for user-invoked
---

# Skill Name

[Ordered steps, each ending on a completion criterion — or flat reference
under co-located headings, or both.]
```

Each **step** ends on a **completion criterion**: make it _checkable_ (can the agent tell done from not-done?) and, where it matters, _exhaustive_ ("every modified model accounted for", not "produce a change list") — a vague bound invites **premature completion** and thin **legwork**. Reach for **leading words** — compact concepts already in the model's pretraining (_lesson_, _fog of war_, _tracer bullets_) — repeated as tokens, never as sentences, to anchor a whole region of behaviour in the fewest tokens.

Add a script when an operation is deterministic, would otherwise be regenerated every run, or needs explicit error handling — it saves tokens and removes variance.

Do not add per-skill `README.md` files. Keep human-facing catalogue text in the repo-root `SKILLS.md`; keep agent-facing behavior in `SKILL.md` and just-in-time support files.

### 4. Write the description (model-invoked only)

The **description** is the only thing the agent sees when choosing a skill. It does two jobs — say what the skill is, and list the triggers:

- Front-load the skill's **leading word** — the word you actually type when you want it.
- One trigger per **branch**; collapse synonyms that merely rename one branch (**duplication**).
- Cut identity already in the body; keep triggers plus any "when another skill needs…" reach clause.

Good: `Extract text and tables from PDFs, fill forms, merge documents. Use when working with PDFs or when the user mentions forms or document extraction.`
Bad: `Helps with documents.` — gives the agent no way to tell it from other document skills.

### 5. Prune

- **Single source of truth**: each meaning in exactly one place, so changing behaviour is a one-place edit.
- **Relevance**: does each line still bear on what the skill does? Cut exposition and stale lines.
- **No-ops**: test each sentence in isolation — does it change behaviour versus the model's default? Delete whole failing sentences, aggressively, rather than trimming words. A weak leading word (_be thorough_) is a no-op; fix it with a stronger word (_relentless_), not more prose.
- Collapse restatements that gesture at one idea into a single **leading word**.

_Done when_ no sentence can be cut without losing behaviour.

### 6. Review

Present the draft and confirm with the user: does it cover every branch? Anything missing or unclear? Should any section be more or less detailed? Then run the checklist.

## Checklist

- [ ] Description front-loads the leading word and gives one trigger per branch — or is stripped, for a user-invoked skill
- [ ] Every step ends on a checkable completion criterion
- [ ] Reference the agent needs only on demand is disclosed behind context pointers, not bloating the top
- [ ] One source of truth per meaning; no time-sensitive facts
- [ ] Concrete examples included; pointers reach one level deep

## Failure modes

Diagnose a misbehaving skill against these (full definitions in [`references/glossary.md`](references/glossary.md)):

- **Premature completion** — a step ends before it is genuinely done. Sharpen its completion criterion first; only if the bound is irreducibly fuzzy _and_ you observe the rush, split the sequence to hide the **post-completion steps**.
- **Duplication** — one meaning in two places. Costs maintenance and inflates the meaning's rank on the ladder.
- **Sediment** — stale layers left because adding feels safe and removing risky. The default fate of any skill without a pruning discipline.
- **Sprawl** — simply too long, even when every line is live and unique. Cure with the hierarchy: disclose reference, and split by branch or sequence.
- **No-op** — a line the model already obeys by default. Pure load, no behaviour change.
