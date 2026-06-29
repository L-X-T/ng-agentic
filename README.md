# NG Agentic Engineering

A practical Angular workspace starter with modern best practices, AI-ready tooling, and scalable project setup guidance.

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.0.0 on June 6th, 2026.

## Generate a new project with the CLI

To start we've created a new Angular project using the `ng new` command:

```shell
ng new ng-agentic
```

This sets up the basic structure of your Angular application, including configuration files, dependencies, and a simple starter component. It also initializes a Git repository for version control.

### fix initial commit

We fixed the initial commit by removing unnecessary duplications of the `AGENTS.md` instructions and running the following command:

```
pnpm format
```

which then executes:

```aiignore
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

```shell
ng add @angular-eslint/schematics
```

This way, we can maintain code quality without having to remember to run the command manually.
