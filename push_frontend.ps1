# PowerShell script to push frontend to GitHub
$repoUrl = "https://github.com/aniruddhasali800-pixel/movies-woldel-.git"
$branchName = "main"

Write-Host "--- Pushing Frontend to GitHub ---" -ForegroundColor Cyan

# Check for git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not installed or not in PATH."
    exit
}

# Ensure we are in the frontend directory
if (!(Test-Path "package.json")) {
    Write-Error "Could not find package.json. Please run this script from the frontend directory. Path: $pwd"
    exit
}

# Initialize git if not already initialized
if (!(Test-Path ".git")) {
    Write-Host "Initializing new git repository..." -ForegroundColor Yellow
    git init
}

# Check if remote exists
$remoteExists = git remote
if ($remoteExists -notcontains "origin") {
    Write-Host "Adding remote origin: $repoUrl" -ForegroundColor Yellow
    git remote add origin $repoUrl
} else {
    Write-Host "Remote origin already exists. Updating URL..." -ForegroundColor Yellow
    git remote set-url origin $repoUrl
}

# Add files
Write-Host "Adding files..." -ForegroundColor Yellow
git add .

# Commit
$commitMessage = "Initial commit: Movies World Frontend"
Write-Host "Committing changes..." -ForegroundColor Yellow
git commit -m $commitMessage

# Push
Write-Host "Pushing to $branchName branch..." -ForegroundColor Yellow
git push -u origin $branchName

if ($LASTEXITCODE -ne 0) {
    Write-Host "Push failed on '$branchName'. Trying 'master' branch as fallback..." -ForegroundColor Yellow
    git push -u origin master
}

Write-Host "--- Done! ---" -ForegroundColor Green
