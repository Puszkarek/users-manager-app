### Creating Issues

Before anything, make sure that doesn't have a related issue
Following the available templates, create a description about the issue and make sure that it's quite understandable

### Branch Conventions

When you get assign to a issue, using the issue number create a new branch based on `dev` branch using one of the following conventions:

- `feature/{issue-number}` - For new features
- `fix/{issue-number}` - For any type of bugs
- `testing/{issue-number}` - For cypress / unit tests (new or fixes)

### Creating Pull-Requests

Soon after you start to work, open the PR as `Draft` using the following structure for the title:
`#{issue-number} - {issue-name}`
