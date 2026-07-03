# Verification contract

Run checks on the final files you will review. Repair and verification are separate operations.

## Commands

From the repository root:

```shell
pnpm workshop:check
```

The runner executes these independently, records each exit status, and exits nonzero if any fails:

```shell
pnpm build
pnpm lint
pnpm exec prettier --check .
pnpm test --watch=false
```

It does not install packages, fix source files, start servers, stage, commit, or push. Build/test tools
may write their usual ignored output and caches. Read the lint summary as well as its exit status:
warnings are findings even when the command succeeds.

Use `pnpm lint --fix` and formatting on the intended files during implementation. Then rerun the
verification contract. A build taken before an autofix does not verify the resulting source.

## Before class

1. Use the facilitator's named branch/revision. Record `git rev-parse HEAD` and `git status --short`.
2. Install the pnpm version in `package.json#packageManager`, then `pnpm install --frozen-lockfile`.
3. Run `pnpm workshop:check`. Save the output with the revision and your Node/pnpm versions.
4. Sign in to your chosen agent and ask it to read a public file in this checkout. Installation alone
   does not prove account access. After Lab 01, also record the loaded project instruction path and
   one successful Angular MCP call.
5. Start the app yourself with `pnpm start`. In Chrome, confirm the expected page loads, a control
   responds, and there is no uncaught startup error. Record the URL and observation.

Do not paste credentials into the report. If a check fails, keep its exact output. Diagnose missing
dependencies, unsupported runtimes, ports, and authentication separately from application failures.

## Workshop material

In the workshop clone, run `pnpm workshop:material` after documentation changes. It checks local file links, HTML anchors,
duplicate IDs and unescaped HTML in lab code samples. It does not verify remote URLs or Markdown
heading anchors. Review examples for correctness and inspect changed lab pages visually as well.

## What a result proves

| Evidence                               | Proves                                    | Does not prove                         |
| -------------------------------------- | ----------------------------------------- | -------------------------------------- |
| Build                                  | Imports, strict types/templates, bundling | Requested behavior                     |
| Lint and formatting                    | Encoded conventions                       | Complete accessibility or sound design |
| Existing unit tests                    | Covered behavior still works              | Untested new requirements              |
| Requirement-specific test/manual check | Named acceptance case                     | All other cases                        |
| Agent review                           | Another set of findings                   | Approval or absence of defects         |

Browser tests are optional until a browser platform is installed. When a task requires browser
evidence, an unavailable runner is an outstanding check, not a pass. Run relevant e2e specs explicitly
against the user-started app. The four-command runner does not include browser tests.

## Baselines and review

Record each command's result, relevant warning/error locations, skipped checks with reasons, and the
behavior cases exercised. Start with a clean tree or describe the existing changes. Record
`git diff --stat` after verification; any further edit invalidates affected results.

At the `setup` checkpoint the application is the Angular starter, with Vitest and no e2e platform.
Build, lint, and unit tests should pass. Formatting differences are repairable setup debt; record their
paths and format only the intended files before establishing your baseline. Later chapters may add
explicit exercise debt. Keep its location and diagnostics in the report. "No new failures" means
comparing diagnostics, not merely comparing totals. A new error cannot be traded for an old fixed one.

A review result states the scope, revision/working-tree inclusion, requirements checked, commands,
confirmed findings, and remaining uncertainty. The human owns acceptance.
