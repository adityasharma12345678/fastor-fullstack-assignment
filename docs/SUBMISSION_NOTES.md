# Submission Notes

## Before making the repository public

- Keep `frontend/.env` and `backend/.env` out of commits. The root `.gitignore` excludes environment files, dependencies, build output, logs, and common caches while allowing `.env.example` files.
- Ensure the `.env.example` files contain placeholders or safe local-only values only.
- If an actual MongoDB password, private JWT secret, or other credential has ever been committed or shared, rotate/revoke it before submission. Removing a value in a later commit does not erase it from Git history.
- Review the staged change and tracked file list before pushing. Check for ignored files that may already be tracked; `.gitignore` does not untrack files that were committed earlier.
- Run the frontend lint/build and backend test commands listed in [FINAL_SETUP.md](./FINAL_SETUP.md).

## Assignment configuration

The frontend defaults to the assignment API at `https://staging.fastor.ai`. Firebase Phone Auth is an optional, separate demo and must be configured with the submitter's Firebase Web app credentials to send SMS.

The CRM backend needs a reachable MongoDB instance, plus a private `JWT_SECRET` of at least 32 characters. Atlas DNS, authentication, and non-SRV setup are documented in [BACKEND_CONNECTION_TROUBLESHOOTING.md](../BACKEND_CONNECTION_TROUBLESHOOTING.md).

## Suggested final checks

From the repository root:

```powershell
git status --short
git ls-files -- frontend/.env backend/.env
git check-ignore -v frontend/.env backend/.env
git diff --check
```

The `git ls-files` command should print no paths. Inspect the complete staged diff before committing, and do not stage `.env` files, `node_modules`, `dist`, or build output.
