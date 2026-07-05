# Outlook

Seven modules built the machinery; this one steps back from it. It sums up what you now have, adds the one topic the workshop has not
covered in depth yet – what all of this costs – and follows the setup out of the room: to your team, into
a monorepo, and into the next model generation. An outlook watches the **horizon**, and the
horizon moves; the point of this module is to know which parts of your setup move with it – and
which part never does.

## Table of Contents

- [What you built](#what-you-built)
- [What it costs](#what-it-costs)
- [Compare two configurations](#compare-two-configurations)
- [Bringing it to your team](#bringing-it-to-your-team)
- [Scaling beyond one app](#scaling-beyond-one-app)
- [Where this is heading](#where-this-is-heading)
- [Further todos: your first week](#further-todos-your-first-week)
- [Using this in the workshop](#using-this-in-the-workshop)

## What You Built

You are not leaving with a bag of tips; you are leaving with a system whose parts reference each
other:

- A **harness** where the repo is the prompt ([Lab 01](labs/01-setup.html)): `AGENTS.md`, the
  [style guide](style-guide/style-guide.md), ESLint + Prettier + hooks, MCP servers, and
  secret-deny rules – conventions the agent reads from the repo instead of you repeating them in
  every prompt.
- A **skills library** ([`02-SKILLS.md`](02-SKILLS.md)): repeatable processes packaged with evaluated selection and process boundaries.
- The **five-part prompt** – observation, goal, constraints, scope, check – and its three levels,
  from simple to grilling ([`03-PROMPTING.md`](03-PROMPTING.md)).
- The **two review passes** – correctness against requirements, then style-guide conformance –
  plus an independent agent reviewer ([`04-REVIEWING.md`](04-REVIEWING.md)).
- The **workflow pyramid**, deciding how much structure belongs between the bookends
  ([`05-HITL-WORKFLOWS.md`](05-HITL-WORKFLOWS.md)).
- The **autonomy ladder**, deciding how closely you watch
  ([`06-AUTONOMOUS-WORKFLOWS.md`](06-AUTONOMOUS-WORKFLOWS.md)).
- The **7-step blueprint** for turning legacy code modern, one verified step at a time
  ([`07-REFACTORING.md`](07-REFACTORING.md)).

And one invariant ran through all seven: **every piece of agentic work opens with a prompt and
closes with your review and your approval – your commit in a live session; in an autonomous run,
your commit of the run's diff or your merge of its branch.** Workflows changed what happens between the bookends,
autonomy changed how closely you watch, refactoring gave the loop a domain – nothing ever moved
the bookends.

## What It Costs

The workshop optimized for quality; production also asks what quality costs. You will not find
real price numbers here – they decay faster than this document – but the decision structure holds
across providers and pricing revisions:

- **Flat subscription vs. token pricing.** A subscription buys predictability: a fixed monthly
  cost, generous interactive use, no meter anxiety while you prompt, grill, and review. That is
  the right default for humans working in the loop. Metered API pricing scales with what you run,
  which makes it the right shape for machines: CI jobs, PR bots, orchestrators, always-on agents –
  anything that consumes tokens while nobody watches the meter. A common setup is both:
  subscriptions for people, metered keys for pipelines – with caps on the metered side.
- **Evaluate configurations on your own tasks.** Use the same baseline and acceptance cases with two
  model/reasoning configurations. Record correctness, elapsed time, review time and repair attempts.
  A mechanical change can still have high impact; a model tier alone does not determine whether it
  is suitable. Repeat before making a reliability claim.
- **Autonomy multiplies spend.** [`06-AUTONOMOUS-WORKFLOWS.md`](06-AUTONOMOUS-WORKFLOWS.md)
  already flagged it: orchestrators cost tokens and produce more output to review, parallel
  sessions share API quotas, and an always-on agent needs a cap on what it can spend. More workers,
  more iterations and longer runs multiply token throughput, so set the spend caps **before** you climb – not
  after the first surprising invoice.
- **Measure accepted outcomes.** Count useful reviewed changes, correct diagnoses, justified rejected
  proposals and evidence-backed blocker reports. Include human review and rework time. A large diff
  or low token count is not by itself a successful outcome.

Cost is only one axis of model choice. Data privacy, hosting constraints, and on-prem options are
the other – the [blog post series](https://www.angulararchitects.io/blog/best-llms-for-angular/)
linked from the README walks through both in depth.

## Compare Two Configurations

Use the [evaluation and adoption sheet](labs/cases/adoption.md). Keep the task, revision, harness,
tools and acceptance cases fixed. Change one model/reasoning configuration at a time. Record
unavailable usage information as unknown, and distinguish observations from estimates.

A worked arithmetic example, with fictional prices: configuration A costs €1.20 and needs 18 minutes
of review; B costs €2.40 and needs 6 minutes. At an assumed €60/hour of human time, those totals are
€19.20 and €8.40 before rework. Both must satisfy the acceptance cases before comparing cost.
These are invented exercise values, not provider prices or a purchasing recommendation.

Define where a runtime, retry or spending limit is enforced. An alert informs someone; it does not
stop spending. Record the behavior after a limit is reached and who can authorize a new run.

## Bringing It to Your Team

One person with a harness is faster; a team sharing a harness compounds. Everything you built in
Lab 01 was designed to be shared – it lives in the repo, not in your head:

- **`AGENTS.md` and the style guide are shared contracts.** Own them like code: they live in the
  repo, change via PR, and get reviewed like code. When an agent gets something wrong for one
  teammate, investigate whether the cause is discovery, a conflicting instruction, missing evidence or model behavior before proposing a shared rule change – the repo is the prompt, now at team
  scale.
- **Commit your skills.** `.agents/skills/` in the repository means every improvement to a skill
  reaches every teammate and every agent on the next pull. Review skill changes with the same care
  as code changes – a skill directs an agent's behavior across the whole team.
- **Decide which artifacts get committed.** Specs, plans, and ADRs from the
  [pyramid's](05-HITL-WORKFLOWS.md) middle steps are cheap to keep and priceless six months later.
  Agree as a team what lands in the repo and where, so decision trails survive the session that
  produced them.
- **Agree on PR etiquette for agent-assisted work.** The human who opens the PR owns it – the same
  invariant, team-sized. "The AI wrote it" is never a defense in review; disclose agent
  involvement however your team prefers, but never let it diffuse accountability.
- **Onboard with the validation loop, not a lecture.** Instead of presenting the conventions, have
  a new teammate run [Lab 01's](labs/01-setup.html#s8) experiment: ask an agent for a small
  feature with no API hints, then review the output against `AGENTS.md` and the style guide.
  Twenty minutes of that teaches how the harness works – and where it still leaks – better than
  any slide deck.

## Scaling Beyond One App

Nothing in this setup assumes a single-app workspace. If you work in an Nx monorepo, the same
pieces transfer directly:

- **Per-project instruction files.** Keep the workspace-wide rules in the root `AGENTS.md` and add
  nested instruction files for apps and libs with local conventions – check the chosen harness’s inheritance and precedence rather than assuming only the nearest file is read. Verify which root and nested instructions were loaded.
- **The Nx MCP server** gives the agent the project graph, generators, and targets as structured
  data instead of guesses – the monorepo counterpart of the `angular-cli` MCP's project list and
  targets used here.
- **`nx affected` is the gauntlet at scale.** Building, linting, and testing only what a diff
  touches keeps the verify-every-step discipline affordable across hundreds of projects.
- **Caching keeps agent feedback loops fast.** Local and remote caching benefit an agent iterating
  against checks exactly as much as they benefit you – a faster gauntlet means more iterations per
  run.

The concepts are workspace-shape-agnostic: the invariant, the pyramid, the ladder, and the
blueprint do not care how many projects your repository holds.

## Where This Is Heading

Models keep improving generation over generation – and your setup should expect that. The
[README](README.md#opinionated-agent-instructions) already warns that this `AGENTS.md` is tuned to
a specific model generation; treat that warning as a standing maintenance task, not a one-time
footnote:

- **Evaluate instructions before pruning or expanding them.** A new model may need different
  guidance, while domain rules and authority boundaries can remain essential. Use a saved task set
  and repeated checks to measure what changes behavior; avoid assuming shorter is always better.
- **Autonomy grows exactly as fast as your verification does.** The ceiling on how far you can
  climb the ladder is not the model – it is your tests, your lint, your e2e coverage, and your
  review capacity. Smarter models raise what is possible; only better checks raise what is safe.
- **Re-validate on every model generation.** When you adopt a new generation, re-run
  [Lab 01's](labs/01-setup.html#s8) validation loop: ask for a feature with no API hints, review
  the output, and prune the rules the model no longer needs. Keep only the rules that measurably
  change the output.

The horizon moves – better models, shorter instruction files, longer leashes. The bookends don't:
whatever the next generation can do unattended, the prompt still opens the loop and your review
still closes it.

## Further Todos: Your First Week

The workshop sticks if the first week converts it into defaults. Five todos, each small:

- [ ] **Promote one convention** from this workshop into your own `AGENTS.md` – then validate it
      with Lab 01's loop instead of trusting it.
- [ ] **Port one skill** (or write your first own one) for a process your team actually repeats.
- [ ] **Pick your first autonomous task** – one bounded job that passes
      [Lab 06's contract](06-AUTONOMOUS-WORKFLOWS.md#the-contract-what-must-be-true-before-you-leave):
      verifiable goal, feedback signal, guardrails.
- [ ] **Wire one CI check an agent can use** – a test suite, lint gate, or build an unattended run
      can converge on.
- [ ] **Decide your model and budget strategy** – subscription vs. metered, which tier for which
      task type, and a spend cap for anything autonomous.

Keep the [cheat sheet](labs/cheat-sheet.html) where you can see it – it is the whole workshop on
one page.

## Using This in the Workshop

Close the loop in [Lab 08 – Outlook](labs/08-outlook.html): hold your project against the brief
and goal you wrote in [Lab 00](labs/00-getting-started.html), write your adoption plan, and decide
your model and budget strategy before you leave.
