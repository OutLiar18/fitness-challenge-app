param(
    [string]$ProjectPath = "C:\Users\Kylep\fitness-tracker"
)

$ErrorActionPreference = "Stop"
$payloadPath = Join-Path $PSScriptRoot "payload"

if (-not (Test-Path $payloadPath)) {
    throw "The updater payload folder could not be found. Extract the entire ZIP before running this script."
}

if (-not (Test-Path $ProjectPath)) {
    throw "Project folder not found: $ProjectPath"
}

if (-not (Test-Path (Join-Path $ProjectPath "package.json"))) {
    throw "The selected folder does not look like the Champions Legacy Challenge project."
}

if (-not (Test-Path (Join-Path $ProjectPath ".env"))) {
    throw "The project .env file was not found. Restore it before applying this update."
}

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$parentFolder = Split-Path $ProjectPath -Parent
$backupPath = Join-Path $parentFolder "fitness-tracker-source-backup-v0.9.0-$timestamp"

Write-Host "Creating source backup:" $backupPath
New-Item -ItemType Directory -Path $backupPath -Force | Out-Null

$robocopyArguments = @(
    $ProjectPath,
    $backupPath,
    "/E",
    "/XD", "node_modules", ".git", "dist",
    "/XF", ".env",
    "/NFL", "/NDL", "/NJH", "/NJS", "/NP"
)

& robocopy @robocopyArguments | Out-Null
if ($LASTEXITCODE -ge 8) {
    throw "The source backup failed with robocopy exit code $LASTEXITCODE."
}

Write-Host "Applying Champions Legacy Challenge v0.9.0..."
Copy-Item -Path (Join-Path $payloadPath "*") -Destination $ProjectPath -Recurse -Force

Write-Host ""
Write-Host "Update applied successfully." -ForegroundColor Green
Write-Host "Your .env, .git folder and node_modules were preserved."
Write-Host "A timestamped source backup was created beside the project folder."
Write-Host ""
Write-Host "Next commands:"
Write-Host "  cd `"$ProjectPath`""
Write-Host "  npm install"
Write-Host "  npm run check"
Write-Host "  npm audit"
Write-Host "  npx firebase-tools deploy --only firestore:rules --project fitnesschallengeapp-9e87f"
Write-Host ""
Write-Host "Then follow docs\01_CURRENT_DEVELOPMENT\ADMIN_BOOTSTRAP.md"
Write-Host "and run: npm run dev"
