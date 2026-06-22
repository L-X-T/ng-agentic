---
name: update-skills-directory
description: Audit .agents/skills so every skill has valid frontmatter, a lean SKILL.md, flat support folders, and a root SKILLS.md link. Use when the user adds, renames, removes, or restructures a skill, or asks to update the skills index/directory. Do not use it to create per-skill README files.
license: MIT
metadata:
  author: Alexander Thalhammer
  version: '1.0'
---

# Update skills directory

Keep `.agents/skills/` aligned with agent-skill best practices: one `SKILL.md` per skill, optional
flat `references/`, `scripts/`, or `assets/` folders, and a repo-root `SKILLS.md` index. Skill
folders are agent artifacts, so do not create per-skill `README.md` files.

## Process

### 1. Enumerate

List every immediate subfolder of `.agents/skills/` and read `SKILLS.md` if it exists.

_Done when_ every skill folder and every current index entry is accounted for.

### 2. Audit each skill

For every skill folder, check:

- `SKILL.md` exists.
- Frontmatter has `name` matching the folder, using only lowercase letters, numbers, and hyphens.
- Frontmatter has a trigger-focused `description` under 1,024 characters, unless the skill is
  intentionally user-invoked.
- `SKILL.md` is under 500 lines and contains high-level procedure or routing, not bulky reference.
- Support files live only in one-level-deep `references/`, `scripts/`, or `assets/` folders.
- `references/` links are explicit and loaded just in time.
- No per-skill `README.md` exists.

_Done when_ each skill has pass/fail notes for structure, frontmatter, disclosure, and index status.

### 3. Audit the root index

Confirm `SKILLS.md` links every skill's `SKILL.md`, contains no stale skill entries, and records
third-party origins in the index rather than in per-skill docs.

_Done when_ the index is one-to-one with the skill folders present.

### 4. Report

Present a concise list of gaps: missing `SKILL.md`, invalid frontmatter, overlong `SKILL.md`,
nonstandard support files, stale links, missing index rows, and forbidden per-skill `README.md`
files.

_Done when_ the user can see every gap at a glance.

### 5. Fix

With approval, make the smallest correction that restores the structure:

- Move bulky support material into `references/`, `scripts/`, or `assets/`.
- Update `SKILL.md` pointers to use relative paths with forward slashes.
- Remove per-skill `README.md` files after preserving any still-useful origin or catalogue text in
  `SKILLS.md`.
- Add missing index rows and remove stale rows.

Do not stage or commit unless the user explicitly asks.

_Done when_ every skill passes the audit and all local links resolve.

## Checklist

- [ ] Every skill folder has one `SKILL.md`.
- [ ] Frontmatter names match folder names and descriptions are trigger-focused.
- [ ] `SKILL.md` files stay under 500 lines.
- [ ] Support files are one level deep under `references/`, `scripts/`, or `assets/`.
- [ ] No per-skill `README.md` files remain.
- [ ] `SKILLS.md` links every skill and no stale skill entries remain.
