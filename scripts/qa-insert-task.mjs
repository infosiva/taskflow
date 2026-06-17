/**
 * Portfolio QA task inserter — called by QA agents to log findings real-time.
 * Usage:
 *   node qa-insert-task.mjs --severity critical --project kwizzo --url https://kwizzo.app \
 *     --issue-type "Logo/Branding" --notes "Navbar logo missing on mobile"
 *   node qa-insert-task.mjs --severity pass --project kwizzo --url https://kwizzo.app \
 *     --issue-type "Chatbot" --notes "Chatbot FAB visible, responds correctly"
 */
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

const args = process.argv.slice(2);
const get = (k) => { const i = args.indexOf(k); return i !== -1 ? args[i + 1] : null; };

const severity = (get('--severity') ?? 'medium').toLowerCase();  // critical | high | medium | low | pass
const project  = get('--project')    ?? 'unknown';
const url      = get('--url')        ?? '';
const issueType= get('--issue-type') ?? 'Other';
const notes    = get('--notes')      ?? '';

// Board/group/column IDs from setup-portfolio-audit.mjs output (hardcoded once board created)
const BOARD_ID   = 'eb9b84b8-a900-4279-b126-bc8878a68402';
const GROUPS = {
  critical: 'b9d6f298-6284-4c2a-b748-2c409c972bbc',
  high:     'b9d6f298-6284-4c2a-b748-2c409c972bbc',  // → Critical bucket
  medium:   'a8a0cb75-63fa-4d34-9c90-95fd1add99d9',
  low:      'a8a0cb75-63fa-4d34-9c90-95fd1add99d9',  // → Needs Fix bucket
  pass:     'a00131c8-a403-48e6-ba3c-50c764bdb893',
};
const COLS = {
  project:   '67691843-97c2-4306-98e4-253a1eadf76a',
  url:       'e2f481cd-f19e-4481-958c-0a1dedc9c77d',
  issueType: '27132f1e-cb22-464b-aac1-87ce306950bb',
  severity:  '7872927a-85c9-4857-9112-4718767e412e',
  notes:     '31e875c9-a800-4d3e-a1df-280007b5ddab',
};

const groupId = GROUPS[severity] ?? GROUPS.medium;
const title = severity === 'pass'
  ? `✅ ${project} — ${issueType}: OK`
  : `${severity === 'critical' ? '🔴' : severity === 'high' ? '🟠' : '🟡'} ${project} — ${issueType}`;

// Get current max position in group
const [{ pos }] = await sql`SELECT COALESCE(MAX(position), 0) as pos FROM tasks WHERE group_id = ${groupId}`;

const [task] = await sql`
  INSERT INTO tasks (group_id, board_id, title, position, created_by)
  VALUES (${groupId}, ${BOARD_ID}, ${title}, ${Number(pos) + 1000}, 'qa-bot')
  RETURNING id
`;

// Insert cell values
const cells = [
  { colId: COLS.project,   value: project },
  { colId: COLS.url,       value: url },
  { colId: COLS.issueType, value: issueType },
  { colId: COLS.severity,  value: severity },
  { colId: COLS.notes,     value: notes },
];

for (const c of cells) {
  await sql`
    INSERT INTO cell_values (task_id, column_id, value)
    VALUES (${task.id}, ${c.colId}, ${JSON.stringify(c.value)})
    ON CONFLICT (task_id, column_id) DO UPDATE SET value = EXCLUDED.value
  `;
}

console.log(`TASK_CREATED: ${task.id} | ${title}`);
