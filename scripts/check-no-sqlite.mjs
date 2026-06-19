import { existsSync } from 'node:fs';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const sqlitePath = join(root, 'node_modules', 'better-sqlite3');
const lockPath = join(root, 'package-lock.json');

if (existsSync(sqlitePath)) {
  console.error(
    'FATAL: better-sqlite3 is installed but this project uses JSON file storage.\n' +
      'Hostinger builds fail on native modules. Remove better-sqlite3 and redeploy from GitHub main.',
  );
  process.exit(1);
}

if (existsSync(lockPath)) {
  const lock = readFileSync(lockPath, 'utf8');
  if (lock.includes('better-sqlite3')) {
    console.error(
      'FATAL: package-lock.json still references better-sqlite3.\n' +
        'Regenerate the lockfile on main and push before deploying.',
    );
    process.exit(1);
  }
}
