# TraceBack AI — Team Collaboration & Contributing Guide

Welcome to the team! This guide is written for beginner developers to contribute smoothly without overwriting teammates' work, leaking credentials, or breaking the build.

---

## 1. Golden Rules

1. **Never Commit Secrets:** Never commit `.env`, API keys, or access tokens. All secrets belong in `.env.local` (which is git-ignored).
2. **Keep Your Files Clear:** Follow the ownership matrix in `docs/TEAM_WORK_PLAN.md`. Avoid editing files owned by teammates at the same time.
3. **Always Run Tests Before Pushing:** Always run `npm test` and `npm run build` locally before opening a pull request or pushing.
4. **Use Meaningful Commit Messages:** Use conventional commit tags:
   - `feat:` for new capabilities
   - `fix:` for bug fixes
   - `ui:` for interface updates
   - `docs:` for documentation updates
   - `test:` for test additions

---

## 2. Local Environment Setup

Our workspace includes portable Node and Git in `.tools/`.

### PowerShell Environment Setup:
Open PowerShell in the project directory and run:
```powershell
$env:PATH = "$PWD\.tools\node-v20.18.0-win-x64;$PWD\.tools\git\cmd;" + $env:PATH
node -v   # Should output v20.18.0
npm -v    # Should output 10.8.2
```

### Running Locally:
```bash
npm install
npm run dev
```
Open your browser at [http://localhost:3000](http://localhost:3000).

---

## 3. Git Workflow Step-by-Step

### Pulling Latest Changes:
Before you begin work, fetch and rebase on `main`:
```bash
git checkout main
git pull origin main
```

### Creating Your Feature Branch:
```bash
git checkout -b feature/member2-approval-card
```

### Checking Your Changes:
```bash
git status
git diff
```

### Staging and Committing:
```bash
git add app/page.tsx
git commit -m "ui: implement human approval gate card with blast radius warning"
```

### Pushing Your Branch:
```bash
git push -u origin feature/member2-approval-card
```

### Merging to Main:
Open a Pull Request on GitHub, confirm all automated checks pass, and have Member 1 merge.

---

## 4. Resolving Conflicts Safely

If git indicates a merge conflict:
1. Don't panic. Git will mark conflicting sections with `<<<<<<<`, `=======`, and `>>>>>>>`.
2. Inspect the file in your editor. Choose the correct combined code.
3. Delete the conflict marker lines.
4. Test that the code runs: `npm run build`.
5. Stage and complete the commit:
   ```bash
   git add <resolved-file>
   git commit -m "merge: resolve conflicts with main"
   git push
   ```
