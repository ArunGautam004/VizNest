# GitHub Collaboration Guide for VizNest

Repository: `https://github.com/Arun0041/VizNest.git`

## Initial Setup (First Time Only)

### 1. Clone the Repository
```bash
git clone https://github.com/Arun0041/VizNest.git
cd VizNest
```

### 2. Configure Git (If not already done)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## Daily Workflow

### Before Starting Work

#### 1. Check Current Branch
```bash
git branch
```

#### 2. Pull Latest Changes from Main Branch
```bash
git checkout main
git pull origin main
```

### Working on a Feature

#### 1. Create a New Branch
```bash
git checkout -b feature/your-feature-name
```

#### 2. Make Your Changes
Edit files as needed, then check what changed:
```bash
git status
```

#### 3. Stage Your Changes
```bash
# Stage specific files
git add filename.ext

# Or stage all changes
git add .
```

#### 4. Commit Your Changes
```bash
git commit -m "Brief description of changes"
```

#### 5. Push Your Branch to GitHub
```bash
git push origin feature/your-feature-name
```

---

## Collaboration Commands

### Pulling Updates from Other Contributors

#### Option 1: Update Your Current Branch
```bash
git pull origin main
```

#### Option 2: Fetch and Merge Manually
```bash
git fetch origin
git merge origin/main
```

### Resolving Merge Conflicts

If you encounter conflicts:

1. **Open conflicted files** - Git will mark conflicts with:
   ```
   <<<<<<< HEAD
   Your changes
   =======
   Their changes
   >>>>>>> branch-name
   ```

2. **Manually edit** the files to resolve conflicts

3. **Stage resolved files:**
   ```bash
   git add conflicted-file.ext
   ```

4. **Complete the merge:**
   ```bash
   git commit -m "Resolved merge conflicts"
   ```

### Syncing Your Branch with Main

```bash
# Switch to main and update
git checkout main
git pull origin main

# Switch back to your branch
git checkout feature/your-feature-name

# Merge main into your branch
git merge main
```

---

## Creating Pull Requests

### Via Command Line (After Pushing)
1. Push your branch: `git push origin feature/your-feature-name`
2. Visit: `https://github.com/Arun0041/VizNest`
3. Click "Compare & pull request"
4. Add description and create PR

### Via GitHub CLI (Optional)
```bash
gh pr create --title "Your PR Title" --body "Description of changes"
```

---

## Useful Commands

### View Commit History
```bash
git log --oneline
```

### See All Branches
```bash
# Local branches
git branch

# Remote branches
git branch -r

# All branches
git branch -a
```

### Switch Between Branches
```bash
git checkout branch-name
```

### Delete a Branch
```bash
# Delete local branch
git branch -d feature/branch-name

# Force delete
git branch -D feature/branch-name

# Delete remote branch
git push origin --delete feature/branch-name
```

### Discard Local Changes
```bash
# Discard changes in specific file
git checkout -- filename.ext

# Discard all local changes
git reset --hard HEAD
```

### Stash Changes Temporarily
```bash
# Save changes temporarily
git stash

# List stashed changes
git stash list

# Apply stashed changes
git stash apply

# Apply and remove from stash
git stash pop
```

---

## Best Practices

1. **Always pull before starting work** - `git pull origin main`
2. **Create feature branches** - Never work directly on `main`
3. **Commit often** with descriptive messages
4. **Pull before pushing** to avoid conflicts
5. **Review changes** before committing - `git diff`
6. **Keep commits focused** - One feature/fix per commit
7. **Write clear commit messages** - Use present tense: "Add feature" not "Added feature"

---

## Common Scenarios

### Scenario 1: Starting a New Feature
```bash
git checkout main
git pull origin main
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
```

### Scenario 2: Updating Your Branch with Latest Changes
```bash
git checkout main
git pull origin main
git checkout feature/your-branch
git merge main
```

### Scenario 3: Fixing Mistakes in Last Commit
```bash
# Modify files
git add .
git commit --amend -m "Updated commit message"
git push --force origin feature/your-branch
```

---

## Troubleshooting

### "Already up to date" but changes exist
```bash
git fetch origin
git reset --hard origin/main
```

### Accidentally committed to wrong branch
```bash
git reset HEAD~1  # Undo last commit, keep changes
git stash         # Save changes
git checkout correct-branch
git stash pop     # Apply changes to correct branch
```

### Need to undo a push
```bash
git reset --hard HEAD~1
git push --force origin branch-name
```

⚠️ **Warning:** Only use `--force` on your own branches, never on `main`!

---

## Getting Help

- Check status: `git status`
- Get help on commands: `git help <command>`
- View this guide anytime
- Ask team members for assistance

---

**Happy Collaborating! 🚀**
