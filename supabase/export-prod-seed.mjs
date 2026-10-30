// Read-only export of the production songs table into supabase/seed.prod.sql,
// which `supabase start` / `supabase db reset` load into the local database.
// Uses the public REST API with the publishable key from .env.local.
//
// Usage: node supabase/export-prod-seed.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync('.env.local', 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.includes('=') && !line.startsWith('#'))
    .map((line) => {
      const i = line.indexOf('=');
      return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')];
    }),
);

const url = env.SUPABASE_URL.replace(/\/$/, '');
const key = env.SUPABASE_PUBLISHABLE_DEFAULT_KEY;

const res = await fetch(
  `${url}/rest/v1/songs?select=id,name,key,lyrics,sort_order,created_at&order=id.asc`,
  { headers: { apikey: key, Authorization: `Bearer ${key}` } },
);
if (!res.ok) throw new Error(`Supabase fetch failed: ${res.status} ${res.statusText}`);
const rows = await res.json();

const q = (v) => (v === null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`);
const values = rows
  .map((r) => `(${r.id}, ${q(r.name)}, ${q(r.key)}, ${q(r.lyrics)}, ${r.sort_order}, ${q(r.created_at)})`)
  .join(',\n');

writeFileSync(
  'supabase/seed.prod.sql',
  `-- Snapshot of the production songs table, exported read-only via the public REST API.
-- Regenerate with: node supabase/export-prod-seed.mjs
TRUNCATE songs RESTART IDENTITY;
INSERT INTO songs (id, name, key, lyrics, sort_order, created_at) OVERRIDING SYSTEM VALUE VALUES
${values};
SELECT setval(pg_get_serial_sequence('songs', 'id'), (SELECT max(id) FROM songs));
`,
);

console.log(`Exported ${rows.length} songs to supabase/seed.prod.sql`);
