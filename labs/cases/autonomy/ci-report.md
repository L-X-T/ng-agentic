# CI reporting before CI writing

Use a trusted manually selected revision and a disposable runner. First practice producing a report
with repository read permission. This is a configuration fragment, not a ready-to-run agent workflow:

```yaml
on:
  workflow_dispatch:
permissions:
  contents: read
jobs:
  report:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@<reviewed-full-commit-sha>
        with:
          persist-credentials: false
          fetch-depth: 2
      - run: git diff --stat HEAD^ HEAD
      # Add your reviewed, version-pinned agent integration here in read-only mode.
      # Save its findings as a job artifact. Do not grant repository write permission.
```

Use the provider's official integration instructions for authentication, version pinning and report
artifacts. Review its requested tools and network access. Do not put credentials in issue text,
checkout files, logs or this example. No agent is installed or scheduled by this fragment.

Before adding a write-capable second job, specify the working-branch namespace, allowed Git actions,
trusted trigger, protected integration branch, credential scope and human review gate. A repository
token with contents: write is broader than a promise to write one branch.

Debrief: which capability would let the runner push, comment, access the provider, or transmit source?
Repository read-only permission only stops pushes made with the job token; it does not stop local edits
or commits, writes with another credential, or network egress.
