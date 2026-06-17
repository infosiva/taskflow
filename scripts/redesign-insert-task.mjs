/**
 * Portfolio Redesign Planning card inserter.
 * Usage:
 *   node --env-file=.env.local scripts/redesign-insert-task.mjs \
 *     --project kwizzo --url https://kwizzo.app \
 *     --category "Gaming" --bg "#0f0f23" --accent "#f59e0b" \
 *     --layout "Split (hero + demo panel)" \
 *     --demo "Quiz cards cycling with score ticker" \
 *     --headline "Play. Learn. Win. Zero boring lectures." \
 *     --changes "1. Animated quiz demo panel 2. Gold accent throughout 3. Branded K logo" \
 *     --priority p0
 */
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

const args = process.argv.slice(2);
const get = (k) => { const i = args.indexOf(k); return i !== -1 ? args[i + 1] : null; };

const project  = get('--project')  ?? 'unknown';
const url      = get('--url')      ?? '';
const category = get('--category') ?? '';
const bg       = get('--bg')       ?? '';
const accent   = get('--accent')   ?? '';
const layout   = get('--layout')   ?? 'Split (hero + demo panel)';
const demo     = get('--demo')     ?? '';
const headline = get('--headline') ?? '';
const changes  = get('--changes')  ?? '';
const priority = (get('--priority') ?? 'p1').toLowerCase();

const BOARD_ID = 'd2590531-8c6b-4991-a068-73ca01175ad0';

const GROUPS = {
  p0: 'ccd2799e-3847-40df-af9c-062c377ce780',
  p1: '853e53af-801f-450f-92a9-4bebadf2b896',
  p2: '9a93a58c-df1d-4948-afe3-562d481a8091',
};

const COLS = {
  project:  '30b47e30-0671-49d5-b770-fb2622806691',
  url:      'f3716177-16a6-4d22-9eea-544f1fc5a5fe',
  category: 'b2975ba4-9fa7-4394-9002-8a0e8387c317',
  bg:       '8c23839d-f303-49c0-9a66-0a320008c89a',
  accent:   'f36cf76f-3455-40a6-99be-7fe21cdfc07c',
  layout:   '2a4e7369-1e58-4dd5-a47e-26c518f461df',
  demo:     'e018d723-02a4-429a-9cc1-767a0f2ed160',
  headline: 'bc11c525-024d-4615-bb68-a821135a6744',
  changes:  '94fa36e0-ddea-4356-ad82-59da609399fa',
  priority: '50ce7eba-cb68-4a25-b196-3dbd6a46dc74',
};

const groupId = GROUPS[priority] ?? GROUPS.p1;
const title = `${project} — redesign`;

const [{ pos }] = await sql`SELECT COALESCE(MAX(position), 0) as pos FROM tasks WHERE group_id = ${groupId}`;

const [task] = await sql`
  INSERT INTO tasks (group_id, board_id, title, position, created_by)
  VALUES (${groupId}, ${BOARD_ID}, ${title}, ${Number(pos) + 1000}, 'design-bot')
  RETURNING id
`;

const cellData = [
  [COLS.project, project],
  [COLS.url, url],
  [COLS.category, category],
  [COLS.bg, bg],
  [COLS.accent, accent],
  [COLS.layout, layout],
  [COLS.demo, demo],
  [COLS.headline, headline],
  [COLS.changes, changes],
  [COLS.priority, priority.toUpperCase()],
];

for (const [colId, value] of cellData) {
  if (!value) continue;
  await sql`
    INSERT INTO cell_values (task_id, column_id, value)
    VALUES (${task.id}, ${colId}, ${JSON.stringify(value)})
    ON CONFLICT (task_id, column_id) DO UPDATE SET value = EXCLUDED.value
  `;
}

console.log(`✓ Card created: ${title} [${priority.toUpperCase()}]`);
