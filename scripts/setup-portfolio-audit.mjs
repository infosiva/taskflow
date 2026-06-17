import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

// system user for agent-created tasks
const [user] = await sql`
  INSERT INTO users (id, email, name)
  VALUES ('qa-bot', 'qa-bot@agents.local', 'Portfolio QA Bot')
  ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name
  RETURNING id
`;

const [ws] = await sql`
  INSERT INTO workspaces (name, slug, owner_id)
  VALUES ('Portfolio Audit', 'portfolio-audit', ${user.id})
  ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
  RETURNING id
`;

await sql`
  INSERT INTO members (workspace_id, user_id, role)
  VALUES (${ws.id}, ${user.id}, 'owner')
`;

const [board] = await sql`
  INSERT INTO boards (workspace_id, name, icon, color, description)
  VALUES (${ws.id}, 'Portfolio QA Audit', '🔎', '#14b8a6', 'Deployed-site checks: nav logo, hero/demo, chatbot, feedback, dead links, mobile overflow')
  RETURNING id
`;

const groupDefs = [
  { name: '🔴 Critical', color: '#ef4444', position: 1 },
  { name: '🟡 Needs Fix', color: '#f59e0b', position: 2 },
  { name: '🟢 Passed', color: '#22c55e', position: 3 },
];
const groups = {};
for (const g of groupDefs) {
  const [row] = await sql`
    INSERT INTO groups (board_id, name, color, position)
    VALUES (${board.id}, ${g.name}, ${g.color}, ${g.position})
    RETURNING id, name
  `;
  groups[g.name] = row.id;
}

const columnDefs = [
  { name: 'Project', type: 'text', position: 1 },
  { name: 'URL', type: 'text', position: 2 },
  { name: 'Issue Type', type: 'dropdown', config: { options: ['Logo/Branding', 'Hero/Demo', 'Chatbot', 'Feedback', 'Dead Link', 'Mobile Overflow', 'Other'] }, position: 3 },
  { name: 'Severity', type: 'priority', config: { options: ['Critical', 'High', 'Medium', 'Low'] }, position: 4 },
  { name: 'Notes', type: 'text', position: 5 },
];
const columns = {};
for (const c of columnDefs) {
  const [row] = await sql`
    INSERT INTO columns (board_id, name, type, config, position)
    VALUES (${board.id}, ${c.name}, ${c.type}, ${JSON.stringify(c.config ?? {})}, ${c.position})
    RETURNING id, name
  `;
  columns[c.name] = row.id;
}

console.log(JSON.stringify({ userId: user.id, workspaceId: ws.id, boardId: board.id, groups, columns }, null, 2));
