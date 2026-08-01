param(
    [string]$TargetPath = "C:\Users\Kylep\fitness-tracker"
)

$ErrorActionPreference = "Stop"

$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$PayloadPath = Join-Path $ScriptRoot "payload"
$TargetPath = [System.IO.Path]::GetFullPath($TargetPath)

if (-not (Test-Path $PayloadPath)) {
    throw "The updater payload folder is missing: $PayloadPath"
}

if (-not (Test-Path $TargetPath)) {
    throw "The target project folder does not exist: $TargetPath"
}

$TargetPackage = Join-Path $TargetPath "package.json"
if (-not (Test-Path $TargetPackage)) {
    throw "No package.json was found in the target folder. Choose the Champions Legacy project root."
}

$CurrentPackage = Get-Content $TargetPackage -Raw | ConvertFrom-Json
if ($CurrentPackage.name -ne "champions-legacy") {
    throw "The selected folder does not appear to be the Champions Legacy project."
}

$Timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$TargetParent = Split-Path -Parent $TargetPath
$BackupPath = Join-Path $TargetParent "fitness-tracker-backup-$Timestamp"

Write-Host "Creating source backup:" $BackupPath
New-Item -ItemType Directory -Path $BackupPath -Force | Out-Null

& robocopy $TargetPath $BackupPath /E /R:2 /W:1 /NFL /NDL /NP `
    /XD ".git" "node_modules" "dist" `
    /XF ".env" "*.rar" "*.zip" "*.backup"

$BackupExitCode = $LASTEXITCODE
if ($BackupExitCode -gt 7) {
    throw "The source backup failed with robocopy exit code $BackupExitCode."
}

$EnvPath = Join-Path $TargetPath ".env"
if (Test-Path $EnvPath) {
    Copy-Item $EnvPath (Join-Path $BackupPath ".env.backup") -Force
    Write-Host "Firebase environment values backed up separately."
} else {
    Write-Warning ".env was not found. Restore your Firebase values before starting the app."
}

Write-Host "Applying Champions Legacy v0.7.0..."
& robocopy $PayloadPath $TargetPath /E /R:2 /W:1 /NFL /NDL /NP

$ApplyExitCode = $LASTEXITCODE
if ($ApplyExitCode -gt 7) {
    throw "The v0.7.0 update failed with robocopy exit code $ApplyExitCode."
}

$ObsoleteFiles = @(
    "HOTFIX_0.5.1.md",
    "DELIVERY_NOTES.md",
    "OPTIMIZATION_SUMMARY.md",
    "VERIFICATION_REPORT.md",
    "fix-auth-context.ps1",
    "src\context\AuthContext.jsx",
    "src\constants\easterEggs.js",
    "src\constants\points\cardioPoints.js",
    "src\services\easterEggService.js",
    "src\services\libraries\exerciseOptionService.js",
    "src\services\migrationService.js",
    "src\services\statisticsService.js",
    "src\services\statistics\daily.js",
    "src\utils\units.js",
    "src\components\common\TimeDurationPicker.jsx",
    "src\components\common\TimeDurationPicker.css"
)

foreach ($RelativePath in $ObsoleteFiles) {
    $FullPath = Join-Path $TargetPath $RelativePath
    if (Test-Path $FullPath) {
        Remove-Item $FullPath -Recurse -Force
        Write-Host "Removed obsolete item:" $RelativePath
    }
}

$UpdatedPackage = Get-Content $TargetPackage -Raw | ConvertFrom-Json
if ($UpdatedPackage.version -ne "0.7.0") {
    throw "The update completed, but package.json does not report version 0.7.0."
}

Write-Host ""
Write-Host "Champions Legacy v0.7.0 has been applied successfully." -ForegroundColor Green
Write-Host "Backup:" $BackupPath
Write-Host ""
Write-Host "Next commands:" -ForegroundColor Cyan
Write-Host "  cd `"$TargetPath`""
Write-Host "  npm install"
Write-Host "  npm run check"
Write-Host "  npm audit"
Write-Host "  npm run dev"
Write-Host ""
Write-Host "Do not run npm audit fix --force."
