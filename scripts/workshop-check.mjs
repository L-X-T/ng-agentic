import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const cwd = new URL('../', import.meta.url);
function runPnpm(args, options) {
  // All arguments come from the fixed commands below, never from task or package text.
  if (process.platform === 'win32') {
    return spawnSync('cmd.exe', ['/d', '/s', '/c', ['pnpm', ...args].join(' ')], options);
  }
  return spawnSync('pnpm', args, options);
}
const commands = [['build'], ['lint'], ['exec', 'prettier', '--check', '.'], ['test', '--watch=false']];
const revision = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd, encoding: 'utf8' });
console.log(`Workshop verification: ${revision.stdout?.trim() || 'unknown revision'}`);
console.log(`Node ${process.version}; expected package manager ${packageJson.packageManager}`);
const version = runPnpm(['--version'], { cwd, encoding: 'utf8' });
console.log(`Installed pnpm: ${version.stdout?.trim() || 'unavailable'}`);
const expectedVersion = packageJson.packageManager.split('@')[1];
const versionMatches = version.status === 0 && version.stdout.trim() === expectedVersion;
if (!versionMatches) console.error('Use the packageManager version from package.json for reproducible results.');

const results = commands.map((args) => {
  console.log(`\nRunning: pnpm ${args.join(' ')}`);
  const result = runPnpm(args, { cwd, stdio: 'inherit', timeout: 600_000 });
  if (result.error) console.error(result.error.message);
  return { command: `pnpm ${args.join(' ')}`, status: result.status ?? 1 };
});
console.log('\nVerification results');
for (const result of results) console.log(`${result.status === 0 ? 'PASS' : 'FAIL'} ${result.command}`);
console.log('Manual checks: agent sign-in, instruction discovery, MCP call, user-started browser, acceptance cases.');
process.exitCode = versionMatches && results.every((result) => result.status === 0) ? 0 : 1;
