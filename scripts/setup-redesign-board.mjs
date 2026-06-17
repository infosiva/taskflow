/**
 * Creates "Portfolio Redesign Planning" board in TaskFlow.
 * Run once: node --env-file=.env.local scripts/setup-redesign-board.mjs
 * Outputs IDs needed for redesign-insert-task.mjs
 */
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

const [user] = await sql`
  INSERT INTO users (id, email, name)
  VALUES ('design-bot', 'design-bot@agents.local', 'Redesign Planning Bot')
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
  RETURNING id
`;

const [ws] = await sql`
  INSERT INTO workspaces (name, slug, owner_id)
  VALUES ('Portfolio Redesign', 'portfolio-redesign', ${user.id})
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id
`;

await sql`
  INSERT INTO members (workspace_id, user_id, role)
  VALUES (${ws.id}, ${user.id}, 'owner')
  ON CONFLICT (workspace_id, user_id) DO NOTHING
`;

const [board] = await sql`
  INSERT INTO boards (workspace_id, name, icon, color, description)
  VALUES (${ws.id}, 'Portfolio Redesign Planning', '🎨', '#6366f1', 'Research-driven redesign plan per project: category, theme, layout, demo panel, copy, priority')
  RETURNING id
`;
console.log('BOARD_ID:', board.id);

const groupDefs = [
  { name: '🔴 P0 — Do Now', color: '#ef4444', position: 1 },
  { name: '🟠 P1 — This Week', color: '#f97316', position: 2 },
  { name: '🟡 P2 — Next Wave', color: '#f59e0b', position: 3 },
  { name: '✅ Done', color: '#22c55e', position: 4 },
];
const groups = {};
for (const g of groupDefs) {
  const [row] = await sql`
    INSERT INTO groups (board_id, name, color, position)
    VALUES (${board.id}, ${g.name}, ${g.color}, ${g.position})
    RETURNING id, name
  `;
  groups[g.name] = row.id;
  console.log(`group[${g.name}]:`, row.id);
}

const columnDefs = [
  { name: 'Project', type: 'text', position: 1 },
  { name: 'URL', type: 'text', position: 2 },
  { name: 'Category', type: 'dropdown', config: { options: ['Education/Quiz', 'Finance/Billing', 'Health/Wellness', 'Productivity/SaaS', 'Travel/Local', 'Dev Tools', 'Media/Creative', 'AI Infra', 'Gaming', 'Food/Cultural', 'News/Trends'] }, position: 3 },
  { name: 'BG Hex', type: 'text', position: 4 },
  { name: 'Accent Hex', type: 'text', position: 5 },
  { name: 'Layout', type: 'dropdown', config: { options: ['Split (hero + demo panel)', 'Centered hero', 'Full-width tool', 'Dark terminal', 'Before/After slider', 'Map/discovery'] }, position: 6 },
  { name: 'Demo Panel', type: 'text', position: 7 },
  { name: 'Hero Headline', type: 'text', position: 8 },
  { name: 'Top 3 Changes', type: 'text', position: 9 },
  { name: 'Priority', type: 'priority', config: { options: ['P0', 'P1', 'P2'] }, position: 10 },
];
const columns = {};
for (const c of columnDefs) {
  const [row] = await sql`
    INSERT INTO columns (board_id, name, type, config, position)
    VALUES (${board.id}, ${c.name}, ${c.type}, ${JSON.stringify(c.config ?? {})}, ${c.position})
    RETURNING id, name
  `;
  columns[c.name] = row.id;
  console.log(`col[${c.name}]:`, row.id);
}
console.log('\nPaste these IDs into redesign-insert-task.mjs');
