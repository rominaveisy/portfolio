param([ValidateSet('dev','build','check','test','preview')][string]$Task='dev')
$ErrorActionPreference='Stop'
$projectPath=Split-Path -Parent $PSScriptRoot
Set-Location -LiteralPath $projectPath
$nodeCommand=Get-Command node -ErrorAction SilentlyContinue
$nodePath=if($nodeCommand){$nodeCommand.Source}else{Join-Path $env:USERPROFILE '.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'}
if(!(Test-Path -LiteralPath $nodePath)){throw 'Node.js is not available. Install a supported Node.js LTS version, then try again.'}
if(!(Test-Path -LiteralPath 'node_modules\astro\bin\astro.mjs')){throw 'Dependencies are missing. Follow the setup steps in README.md.'}
$env:ASTRO_TELEMETRY_DISABLED='1'
switch($Task){
  'build' { & $nodePath scripts/build.mjs }
  'test' { & $nodePath node_modules/@playwright/test/cli.js test }
  'check' { & $nodePath node_modules/astro/bin/astro.mjs check }
  default { & $nodePath node_modules/astro/bin/astro.mjs $Task --host 127.0.0.1 }
}
exit $LASTEXITCODE
