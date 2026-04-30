# GitHub CLI Authentication Setup

## 📋 GitHub Personal Access Token Setup

Since we couldn't find your existing GitHub token file, here's how to set up GitHub CLI authentication:

### 🔐 Method 1: Create a Personal Access Token

1. **Go to GitHub Settings**:
   - Visit: https://github.com/settings/tokens
   - Click "Generate new token" → "Generate new token (classic)"

2. **Configure Token**:
   - **Note**: "CodexHash CLI Access"
   - **Expiration**: 90 days (or as needed)
   - **Scopes** (check these):
     - ✅ `repo` (Full control of private repositories)
     - ✅ `workflow` (Update GitHub Action workflows)
     - ✅ `admin:repo_hook` (Full control of repository hooks)
     - ✅ `delete_repo` (Delete repositories)

3. **Copy the Token**: 
   - Save it immediately (you won't see it again!)
   - Format: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 🔧 Method 2: Authenticate with GitHub CLI

Run one of these commands:

#### Option A: With Token
```bash
gh auth login --with-token
# Then paste your token when prompted
```

#### Option B: Web Browser
```bash
gh auth login
# Follow the interactive prompts
# Choose: GitHub.com → HTTPS → Yes → Web browser
```

#### Option C: Direct Token Setup
```bash
echo "your_token_here" | gh auth login --with-token
```

### ✅ Verify Authentication

```bash
gh auth status
gh repo list web3connected
```

### 🚀 After Authentication, Run Setup

```bash
cd /home/web3codex/projects/codex_hash
./setup-github-secrets.sh
```

## 📝 Required Secrets for CodexHash

Once authenticated, the setup script will configure:

- **DEPLOY_HOST**: `45.79.180.207`
- **DEPLOY_USER**: `forge` 
- **DEPLOY_PRIVATE_KEY**: Your SSH private key

## 🔄 Alternative: Manual Secret Setup

If you prefer to set secrets manually:

```bash
# Set each secret individually
gh secret set DEPLOY_HOST --body "45.79.180.207"
gh secret set DEPLOY_USER --body "forge"
gh secret set DEPLOY_PRIVATE_KEY < ~/.ssh/id_rsa
```

## 🚨 Security Notes

- Keep your personal access token secure
- Rotate tokens regularly (every 90 days recommended)
- Use minimal required scopes
- Never commit tokens to repositories