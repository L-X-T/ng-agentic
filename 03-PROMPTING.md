# Prompting & Context

Every piece of agentic work starts with a prompt, and the prompt is one of the factors you can improve alongside the harness, tools, verification and model. A prompt is not a wish – it is a
work order: it tells the agent what you observed, what you want, what must not change, and how
both of you will know the work is done.

This guide covers the three levels of prompting used throughout this workshop – the **simple
prompt**, the **interactive prompt**, and the **intense session** (grilling or brainstorming) –
when each one pays off, and how to manage the context and sessions the prompts run in.

## Table of Contents

- [The anatomy of a good prompt](#the-anatomy-of-a-good-prompt)
- [Make the check behavioral](#make-the-check-behavioral)
- [Context is part of the prompt](#context-is-part-of-the-prompt)
- [Level 1 – The simple prompt](#level-1--the-simple-prompt)
- [Level 2 – The interactive prompt](#level-2--the-interactive-prompt)
- [Level 3 – The intense session](#level-3--the-intense-session)
- [Choosing the level](#choosing-the-level)
- [Managing context and sessions](#managing-context-and-sessions)
- [Anti-patterns](#anti-patterns)
- [Using this in the workshop](#using-this-in-the-workshop)

## The Anatomy of a Good Prompt

A good prompt starts with an **observation**, a **goal**, and **constraints**, then states
**scope** (which file, which context, desired output) and the **check** (ESLint-clean, tests
pass). This is the _prompting order_, and the
[refactoring blueprint](.agents/skills/ng-refactor/references/blueprint.md) uses it too:

1. **Observation** – what you see: the bug, the smell, the missing behavior. Ground the agent in
   the same reality you are looking at.
2. **Goal** – the outcome, not the method. "Users can filter the table by status" beats "add an
   if statement to the filter function".
3. **Constraints** – what must not change: public APIs, behavior, style-guide rules, files that
   are out of bounds.
4. **Scope** – where to work: the files, the component, the feature folder. Name paths; do not
   make the agent guess.
5. **Check** – the definition of done the agent can verify itself: a green build, a passing
   test, a clean lint run.

The five parts expose assumptions before implementation. They do not guarantee correctness; verify the behavior and inspect the diff.

## Make the Check Behavioral

Use the [booking-filter acceptance sheet](labs/cases/booking-filter.md) for all three levels –
mapped onto a sortable list in your own project, or as the template for a sheet for a task of your
own. It supplies fixed inputs, six observable cases and a comparison table. Build and lint establish
static validity; existing tests protect only the behavior they cover. A new feature also needs
evidence that it exists and works.

Try reviewing a no-op patch against the request. It may pass every existing check while failing
the first new acceptance case. Pair automated feedback with requirement-specific tests or explicit
manual observations. Use [VERIFICATION.md](VERIFICATION.md) for the shared static protocol.

## Context Is Part of the Prompt

The words you type are only half the prompt; the other half is what the agent can see. Keep that
half deliberate:

- **Point at files instead of describing them.** A path costs a few tokens and is always
  accurate; a from-memory description costs a paragraph and is often stale.
- **A screenshot can be the observation.** For visual bugs, a pasted screenshot of the broken
  layout beats three sentences describing it – the screenshot tools from Lab 01's bonus step pay
  off here.
- **Lean on skills for process.** When a task matches a skill from [`02-SKILLS.md`](02-SKILLS.md),
  describe the task in the skill's own words and let the skill carry the process – the prompt
  stays short and the process stays repeatable.
- **Keep the window lean.** A bloated context dilutes attention and buries your instructions.
  Prefer a narrow, task-specific prompt over pasting everything that might be relevant.

## Level 1 – The Simple Prompt

For small, local, low-ambiguity work, write the five parts in a few sentences and let the agent
run:

```text
The booking table shows cancelled bookings mixed in with active ones (observation).
Add a status filter above the table so users can hide cancelled bookings (goal).
Don't change the BookingService API or the table's sorting behavior (constraints).
Work in src/app/bookings/ only (scope).
Done when Active hides cancelled bookings, All restores them, sorting still works,
and keyboard and empty-state checks pass, alongside the static baseline (check).
```

That is the whole technique. If you can state all five parts without hesitating, the work is
probably small enough that this level is the right one – added ceremony would only slow you
down.

## Level 2 – The Interactive Prompt

When you cannot state the constraints or the scope confidently, don't guess – make the agent
interview you. Run the prompt in two beats: **(1) plan and ask clarifying questions, then
(2) implement.** Never let an agent jump straight to a rewrite.

```text
I want to add a status filter to the booking table.
Before you write any code: propose a short plan and ask me clarifying
questions, one at a time, until the scope is unambiguous.
Then implement the plan we agreed on.
```

Two details do the heavy lifting:

- **"One at a time."** A block of eight questions gets skimmed and half-answered. One question
  gets a real answer, and each answer sharpens the next question.
- **"Before you write any code."** The stop condition keeps the agent from implementing its own
  first guess while you are still typing answer two.

Answering questions feels slower than watching code appear. It is almost always faster than
reviewing code built on the wrong assumption.

## Level 3 – The Intense Session

For ambiguous or high-impact work – a new feature with real design choices, a refactoring with
many valid end states, anything where a wrong assumption is expensive – escalate from questions
to a structured session driven by a skill:

- [`grill-me`](.agents/skills/grill-me/SKILL.md) (third-party, by Matt Pocock) interrogates your
  plan relentlessly, one question at a time, walking every branch of the decision tree until you
  and the agent share the same understanding.
- [`grill-with-style`](.agents/skills/grill-with-style/SKILL.md) (custom) does the same but
  grounds every question in this project's domain language and
  [style guide](style-guide/style-guide.md) – it challenges your plan against the rules you have
  already committed to, and sharpens fuzzy terminology as you go.
- [`brainstorming`](.agents/skills/brainstorming/SKILL.md) (third-party) flips the direction:
  instead of stress-testing a plan you already have, it explores intent and requirements first
  and refuses to let any implementation start before you approve a design.

Rule of thumb: bring a **plan** to a grilling; bring an **idea** to a brainstorming. Either way
the deliverable of the session is shared understanding written down – decisions, constraints,
and terminology the implementation prompt can then reference in one line.

## Choosing the Level

| Situation                                              | Level                                     |
| ------------------------------------------------------ | ----------------------------------------- |
| Small fix, you can state all five prompt parts         | Simple prompt                             |
| You are unsure about constraints, scope, or edge cases | Interactive prompt – agent asks you       |
| Real design choices, expensive if wrong                | Grilling (`grill-me`, `grill-with-style`) |
| Only an idea so far, no plan yet                       | Brainstorming                             |

The levels stack: a grilling session ends with an agreed plan, and that plan becomes the
observation/goal/constraints of a simple implementation prompt. Escalate when ambiguity is high,
de-escalate when it is resolved.

## Managing Context and Sessions

The levels decide how a session starts; just as important is how long you let one run. The
context window is a budget: everything in the session – your instructions, every file the agent
read, every tool transcript, every dead end – competes for the model's attention. A lean session
outperforms a stuffed one, for the same reason a narrow skill beats a bloated `AGENTS.md`: this
is the session-level version of the context-hygiene argument from
[`02-SKILLS.md`](02-SKILLS.md#why-skills-keep-your-context-clean).

A degraded session announces itself. The agent forgets constraints you agreed on earlier, or
contradicts decisions it made itself twenty messages ago. It repeats broad searches without using
what it learned. Diffs get sloppier, answers get vaguer – the crispness of the session's first hour is gone.

When you see those symptoms, the fix is rarely to push harder – more instructions into an
overdrawn budget just dilute attention further. Instead:

- **One task per session.** When the task is done, start fresh. Carry the decisions worth keeping
  forward in writing, not in the session's memory.
- **Compact mid-task when you must.** Most harnesses can summarize the conversation and continue
  (e.g. `/compact` in Claude Code). Useful when you cannot afford to stop – but a summary loses
  nuance, and a constraint you stated once in passing is exactly the detail it drops. Treat
  compaction as a lossy checkpoint, not a free lunch.
- **Hand over between sessions.** For work that spans sessions, end each one by writing a
  handover document and start the next session from it. This repo ships the
  [`handover`](.agents/skills/handover/SKILL.md) skill for exactly this: it compacts the
  conversation into a document that points the next agent at the decisions, artifacts, and
  skills that matter. The handover doc is the session-level equivalent of the written shared
  understanding a grilling produces.

This is why the five parts matter beyond the first message: a fresh session only works because
the five-part prompt – plus the handover or decision doc it references – carries forward
everything that matters. The session's memory is disposable; the written record is not.

## Anti-Patterns

- **The vague verb.** "Improve", "clean up", "make it nicer" – no observation, no check. The
  agent will pick its own definition of nicer, and it will not be yours.
- **The mega-prompt.** Ten requirements in one message get partially satisfied. Split the work,
  or escalate to a session and let the plan hold the ten requirements instead.
- **Missing constraints.** Invariants you leave unstated – the public API, existing behavior, files
  that are off limits – get decided by the agent. Name them; do not rely on it to find every
  caller of the code it changes.
- **No check.** Without a verifiable "done", the agent stops when the output _looks_ complete.
  Tie "done" to the requested behavior as well as lint and relevant tests.
- **Answering questions nobody asked.** Dumping context the task doesn't need buries the parts
  it does need. Lean beats complete.

## Using This in the Workshop

Work through [Lab 03 – Prompting & Context](labs/03-prompting.html) after the setup and skills
labs. Use the project you chose in [Lab 00](labs/00-getting-started.html) for the exercises:
map the booking filter onto one of its lists, or bring a task it needs and write the acceptance
sheet for it first – prompting technique sticks best when the answers are ones you actually care
about.
