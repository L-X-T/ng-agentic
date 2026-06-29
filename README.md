# NG Agentic Engineering

A practical Angular workspace starter with modern best practices, AI-ready tooling, and scalable project setup guidance.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.0 on June 6th, 2026.

## Generate a new project with the CLI

To start we've created a new Angular project using the `ng new` command:

```shell
ng new ng-agentic
```

This sets up the basic structure of your Angular application, including configuration files, dependencies, and a simple starter component. It also initializes a Git repository for version control.

### Fix initial commit

We fixed the initial commit by removing unnecessary duplications of the `AGENTS.md` instructions and running the following command:

```shell
pnpm format
```

which then executes:

```shell
prettier --write .
```

To avoid doing this manually every time, we can set up a pre-commit hook using Husky to automatically run the formatter before each commit.

## Install & setup Husky

### Install Husky

```shell
pnpm add -D husky
```

### Initialize Husky

```shell
pnpm exec husky init
```

### Update .husky/pre-commit

```shell
pnpm format
```

## Install Angular ESLint

To ensure code quality and consistency, we install Angular ESLint in our project. This tool helps us identify and fix issues in our TypeScript code according to best practices.

Our pre-commit hook only runs the formatter so far, so we add Angular ESLint with the following command:

```shell
ng add angular-eslint
```

Besides the `angular-eslint` package itself this also registers the `angular-eslint` schematic collection in `angular.json` and pins `@angular-eslint/builder` as an explicit devDependency, so the lint builder resolves reliably under pnpm.

### Lint-staged

We configured Angular ESLint to run as part of our development workflow, ensuring that any new code adheres to our coding standards before it's committed to the repository.

```shell
pnpm add -D lint-staged
```

In our `package.json`, we added the following configuration to run ESLint on staged files:

```json
{
  "lint-staged": {
    "*.{html,js,ts}": ["eslint --fix", "prettier --write"],
    "*.{css,json,md,scss}": ["prettier --write"]
  }
}
```

We updated our Husky pre-commit hook to run lint-staged:

```shell
pnpm exec lint-staged
```

This way, we can maintain code quality without having to remember to run the commands manually.

### Extend ESLint configuration

By adding more rules to our flat ESLint configuration in `eslint.config.js`, we can enforce better
coding practices and catch potential issues early. Look at `eslint.config.js` to see my
recommendations.

To apply the new ESLint rules, we can run the following command:

```shell
ng lint --fix
```

There are two remaining issues that we need to fix manually:

```text
/Users/lxt/ng/ng-agentic/src/app/app.ts
  4:1  warning  The component's `changeDetection` value should be set to `ChangeDetectionStrategy.OnPush`  @angular-eslint/prefer-on-push-component-change-detection

/Users/lxt/ng/ng-agentic/src/main.server.ts
  5:47  error  Missing return type on function  @typescript-eslint/explicit-function-return-type
```

Because these are mechanical fixes, we can ask `codex` or another agent to make them for us.
