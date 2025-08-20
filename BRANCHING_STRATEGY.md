# Branching Strategy

This project follows a branching model based on GitFlow. The primary branches are:

- `main`: This branch contains production-ready code. All development should be done in separate branches.
- `develop`: This is the main development branch. It's where all feature branches are merged.

## Workflow

1.  Create a new feature branch from `develop`: `git checkout -b feature/your-feature-name develop`
2.  Work on your feature and commit your changes.
3.  Push your feature branch to the remote repository.
4.  Open a pull request from your feature branch to `develop`.
5.  After the pull request is reviewed and approved, it will be merged into `develop`.
6.  When it's time for a release, a release branch is created from `develop`, and eventually merged into `main`.
