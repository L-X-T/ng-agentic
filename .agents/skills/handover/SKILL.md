---
name: handover
description: Compact the current conversation into a handover document for another agent to pick up.
argument-hint: 'What will the next session be used for?'
license: MIT
metadata:
  author: Alexander Thalhammer
  version: '1.0'
---

# Handover

Write a handover document summarising the current conversation so a fresh agent can continue the work. Save it to a path produced by `mktemp "${TMPDIR:-/tmp}/handover.XXXXXX.md"` (read the file before you write to it). The `XXXXXX` placeholder is intentional: it must be replaced by the generated random hash, not left in the filename with a hash appended after `.md`.

Suggest the skills to be used, if any, by the next session.

Do not duplicate content already captured in other artifacts (PRDs, plans, ADRs, issues, commits, diffs). Reference them by path or URL instead.

If the user passed arguments, treat them as a description of what the next session will focus on and tailor the doc accordingly.

If the next session involves implementation, prototyping, architecture, or documentation, mention that the agent should follow `style-guide/style-guide.md` and load the relevant specific guide.
