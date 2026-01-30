# 🔐 GitHub Repository Setup Guide

## Repository Structure

### 1. **Main Repository: `proverbs-book-ai`** (Public with Approval)

**Purpose**: Proverbs Book AI application

**Visibility**: Public (but requires approval for contributions)

**Contains**:
- `backend-api/` - Backend API server
- `desktop_app/` - Electron desktop application
- `website/` - Download and landing pages
- `admin-panel/` - Admin dashboard
- Documentation

**Access Control**:
- ✅ Public read access
- ⚠️ Requires approval for:
  - Push access
  - Pull requests
  - Issues
  - Collaborator access

---

### 2. **Financial Advisor Repository: `financial-advisor-ai`** (Private)

**Purpose**: Personal financial advisor and tax tool

**Visibility**: Private (owner only)

**Contains**:
- `financial-advisor/` - Complete application
- All code and configuration
- Personal financial data (if stored)

**Access Control**:
- 🔒 Private repository
- 👤 Owner access only
- ❌ No public access
- ❌ No external contributors

---

## 🚀 Setup Instructions

### Step 1: Create Main Repository (Public)

1. **Go to GitHub**: https://github.com/new

2. **Repository Settings**:
   - Name: `proverbs-book-ai`
   - Description: "AI-powered book writing application for Proverbs"
   - Visibility: **Public**
   - Initialize: ✅ Add README
   - License: MIT

3. **Push Code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/parker007lued/proverbs-book-ai.git
   git push -u origin main
   ```

4. **Configure Access Control**:
   - Go to **Settings** → **Collaborators**
   - Enable **"Require approval for all pull requests"**
   - Enable **"Require review for pull requests"**
   - Set branch protection rules

---

### Step 2: Create Financial Advisor Repository (Private)

1. **Go to GitHub**: https://github.com/new

2. **Repository Settings**:
   - Name: `financial-advisor-ai`
   - Description: "Private financial advisor and tax tool"
   - Visibility: **Private** ⚠️
   - Initialize: ✅ Add README
   - License: None (private)

3. **Push Code**:
   ```bash
   cd financial-advisor
   git init
   git add .
   git commit -m "Initial commit - Private repository"
   git branch -M main
   git remote add origin https://github.com/parker007lued/financial-advisor-ai.git
   git push -u origin main
   ```

4. **Verify Privacy**:
   - Go to **Settings** → **General**
   - Confirm **"Change repository visibility"** shows **Private**
   - Under **Danger Zone**, verify it's private

---

## 🔐 Access Control Configuration

### Main Repository (Public with Approval)

#### Branch Protection Rules:

1. Go to **Settings** → **Branches**
2. Add rule for `main` branch:
   - ✅ Require pull request reviews before merging
   - ✅ Require approvals: 1
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Include administrators

#### Collaborator Access:

1. Go to **Settings** → **Collaborators**
2. Click **"Add people"**
3. Enter email/username
4. Select role: **Read** (default)
5. User must accept invitation
6. **You approve** before they get write access

#### Issue/PR Templates:

Create `.github/ISSUE_TEMPLATE.md` and `.github/PULL_REQUEST_TEMPLATE.md`

---

### Financial Advisor Repository (Private)

#### Privacy Settings:

1. Go to **Settings** → **General**
2. Scroll to **"Danger Zone"**
3. Verify: **"This repository is private"**
4. **Do NOT** make it public

#### Access:

- Only you have access
- No collaborators
- No public visibility
- No forks allowed (if desired)

---

## 📋 Repository Templates

### Main Repo `.github/ISSUE_TEMPLATE.md`:

```markdown
# Issue Template

## Description
[Describe the issue]

## Steps to Reproduce
1. Step one
2. Step two

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Platform
- [ ] Windows
- [ ] macOS
- [ ] Linux
- [ ] iPad

## Additional Context
[Any other information]
```

### Main Repo `.github/PULL_REQUEST_TEMPLATE.md`:

```markdown
# Pull Request

## Description
[Describe your changes]

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactoring

## Testing
- [ ] Tested on Windows
- [ ] Tested on macOS
- [ ] Tested on Linux

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
```

---

## 🔗 Connecting Repositories

### Submodule Approach (Optional):

If you want to reference Financial Advisor from Main:

```bash
# In main repository
   git submodule add https://github.com/parker007lued/financial-advisor-ai.git financial-advisor-reference
```

**Note**: This creates a reference but doesn't expose private code.

---

## ✅ Verification Checklist

### Main Repository:
- [ ] Repository is public
- [ ] Branch protection enabled
- [ ] PR approval required
- [ ] Collaborators require approval
- [ ] README.md present
- [ ] LICENSE file present
- [ ] .gitignore configured
- [ ] Documentation complete

### Financial Advisor Repository:
- [ ] Repository is private
- [ ] Only owner has access
- [ ] No public visibility
- [ ] .gitignore configured
- [ ] README indicates private use
- [ ] No sensitive data committed

---

## 🚨 Security Notes

1. **Never commit**:
   - `.env` files
   - API keys
   - Passwords
   - Personal financial data
   - Database credentials

2. **Use environment variables**:
   - Store secrets in `.env` (gitignored)
   - Use GitHub Secrets for CI/CD

3. **Review before pushing**:
   - Check for sensitive data
   - Verify .gitignore is working
   - Review file contents

---

## 📞 Support

For repository access requests or questions:
- Contact repository owner
- Use GitHub Issues (main repo only)
- Email for private repo questions

---

**Setup complete! Your repositories are ready.**
