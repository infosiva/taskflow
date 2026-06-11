export const dynamic = 'force-dynamic'

const TASKFLOW_PLAN = {
  research: {
    headline: "Your AI teammate that ships sprints.",
    subheadline: "Replace: \"Ship projects. Not spreadsheets.\"",
    gap: "Height shut down Sep 2025 — their displaced users are searching NOW. No obvious successor. TaskFlow can own that vacancy.",
    competitors: [
      { name: "Linear", weakness: "Engineering-only, enterprise bloat", threat: "High" },
      { name: "ClickUp", weakness: "Billing scandal (+733% hidden costs)", threat: "Medium" },
      { name: "Notion AI", weakness: "$15/seat AI wall", threat: "Medium" },
      { name: "Height", weakness: "DEAD (Sep 2025) — users homeless", threat: "Opportunity" },
      { name: "Taskade", weakness: "Pivoted to app-builder, not PM", threat: "Low" },
      { name: "Todoist", weakness: "No teams, 40% price hike", threat: "Low" },
    ],
    moves: [
      { n: 1, title: "Height users: welcome home", desc: "Landing page targeting displaced Height users. They want AI-native PM. They're searching now." },
      { n: 2, title: "Lead with AI agent loop", desc: "Hero must show: auto-assign sprint summary agent activity. Not 'vs spreadsheets'." },
      { n: 3, title: "Team of 5 forever free", desc: "Weaponise free tier against ClickUp billing trap. 'No seat surprises. AI included.'" },
    ],
  },
  redesign: {
    current: "Dark #0a0a0b + teal — Pattern B/C. Generic SaaS dark. Must differentiate.",
    direction: "Light productivity SaaS — #ffffff bg, #2563eb blue accent. TaskFlow standard (same as billslash but different layout).",
    hero: "Split: left = headline + AI agent demo CTA, right = animated kanban board cycling tasks",
    sections: ["Hero + stats", "How AI loop works (3 steps)", "Competitor comparison strip", "Pricing (free forever + team tier)", "Height migration CTA"],
  },
  portfolio: [
    { project: "billslash", status: "DONE", commit: "70bec46", change: "Light fintech theme, animated typing demo, hub theme-loader wired" },
    { project: "taskflow", status: "PLANNED", change: "New positioning, light theme, AI loop hero, Height migration page" },
    { project: "ai-social-content", status: "QUEUED", change: "Remove Pattern C purple gradient, redesign" },
    { project: "complybuddy", status: "QUEUED", change: "Remove Pattern C purple/violet, redesign" },
    { project: "clipforge-ai", status: "QUEUED", change: "Remove Pattern B dark+green, redesign" },
    { project: "neuralos", status: "QUEUED", change: "Remove Pattern C purple/violet, redesign" },
    { project: "parceliq", status: "QUEUED", change: "Remove Pattern C purple/violet, redesign" },
    { project: "zerostaff", status: "QUEUED", change: "Verify + remove Pattern C if present, redesign" },
    { project: "quicktech", status: "QUEUED", change: "Remove violet accents, redesign" },
    { project: "firstline", status: "QUEUED", change: "Remove Pattern B terminal/green, redesign" },
    { project: "vidrush", status: "QUEUED", change: "Add supporting sections, remove sparse anti-pattern" },
    { project: "protoforge", status: "QUEUED", change: "Audit only — check if Pattern A/B/C" },
  ],
}

const STATUS_COLOR: Record<string, string> = {
  DONE: "#16a34a",
  PLANNED: "#2563eb",
  QUEUED: "#94a3b8",
  "IN PROGRESS": "#d97706",
}

export default function PlanPage() {
  const { research, redesign, portfolio } = TASKFLOW_PLAN

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#f8fafc", minHeight: "100vh", color: "#0f172a" }}>
      {/* Header */}
      <div style={{ background: "#0f172a", color: "#fff", padding: "24px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontSize: 20, fontWeight: 900 }}>Task<span style={{ color: "#14b8a6" }}>Flow</span></span>
          <span style={{ marginLeft: 16, fontSize: 13, color: "#64748b", background: "#1e293b", padding: "3px 10px", borderRadius: 999 }}>Plan Review</span>
        </div>
        <span style={{ fontSize: 12, color: "#475569" }}>Generated 2026-06-11</span>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>

        {/* Section 1: Research findings */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Research Findings</h2>
          <p style={{ color: "#64748b", marginBottom: 24, fontSize: 14 }}>Deep pass: Linear, ClickUp, Notion, Height, Taskade, Todoist, Fibery</p>

          {/* New headline */}
          <div style={{ background: "#fff", border: "2px solid #2563eb", borderRadius: 12, padding: "20px 24px", marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Recommended new positioning</div>
            <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.5px" }}>{research.headline}</div>
            <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>{research.subheadline}</div>
          </div>

          {/* Gap callout */}
          <div style={{ background: "rgba(22,163,74,0.06)", border: "1px solid rgba(22,163,74,0.25)", borderRadius: 10, padding: "16px 20px", marginBottom: 24 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#16a34a", textTransform: "uppercase", letterSpacing: "0.06em" }}>Key opportunity: </span>
            <span style={{ fontSize: 14, color: "#0f172a" }}>{research.gap}</span>
          </div>

          {/* Competitor table */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>Competitor</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>Key Weakness</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>Threat Level</th>
                </tr>
              </thead>
              <tbody>
                {research.competitors.map((c, i) => (
                  <tr key={c.name} style={{ borderBottom: i < research.competitors.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: "12px 16px", color: "#475569" }}>{c.weakness}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                        background: c.threat === "Opportunity" ? "rgba(22,163,74,0.1)" : c.threat === "High" ? "rgba(220,38,38,0.1)" : c.threat === "Medium" ? "rgba(217,119,6,0.1)" : "rgba(148,163,184,0.15)",
                        color: c.threat === "Opportunity" ? "#16a34a" : c.threat === "High" ? "#dc2626" : c.threat === "Medium" ? "#d97706" : "#64748b",
                      }}>{c.threat}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 2: Strategic moves */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>Top 3 Strategic Moves</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {research.moves.map(m => (
              <div key={m.n} style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "20px" }}>
                <div style={{ width: 32, height: 32, background: "rgba(37,99,235,0.08)", border: "1px solid rgba(37,99,235,0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#2563eb", marginBottom: 12 }}>{m.n}</div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{m.title}</div>
                <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.55 }}>{m.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 3: Redesign plan */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>TaskFlow Redesign Plan</h2>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, padding: "24px" }}>
            <div style={{ display: "grid", gap: 16 }}>
              {[
                { label: "Current design", value: redesign.current, warn: true },
                { label: "New direction", value: redesign.direction, warn: false },
                { label: "Hero layout", value: redesign.hero, warn: false },
              ].map(row => (
                <div key={row.label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", minWidth: 120, paddingTop: 2 }}>{row.label}</span>
                  <span style={{ fontSize: 13, color: row.warn ? "#dc2626" : "#0f172a", lineHeight: 1.55 }}>{row.value}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", minWidth: 120, paddingTop: 2 }}>Sections needed</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {redesign.sections.map(s => (
                    <span key={s} style={{ fontSize: 12, background: "#f1f5f9", color: "#475569", padding: "3px 10px", borderRadius: 6, fontWeight: 500 }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Portfolio status */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Portfolio Redesign Status</h2>
          <p style={{ fontSize: 14, color: "#64748b", marginBottom: 20 }}>Anti-pattern wave — removing Pattern A/B/C from all projects</p>
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>Project</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>Status</th>
                  <th style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#475569" }}>Change</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((p, i) => (
                  <tr key={p.project} style={{ borderBottom: i < portfolio.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600 }}>{p.project}</td>
                    <td style={{ padding: "12px 16px" }}>
                      <span style={{
                        padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600,
                        background: p.status === "DONE" ? "rgba(22,163,74,0.1)" : p.status === "PLANNED" ? "rgba(37,99,235,0.1)" : "rgba(148,163,184,0.12)",
                        color: STATUS_COLOR[p.status] ?? "#64748b",
                      }}>{p.status}</span>
                    </td>
                    <td style={{ padding: "12px 16px", color: "#475569" }}>{p.change}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Approval section */}
        <section style={{ background: "#0f172a", borderRadius: 16, padding: "32px", color: "#fff" }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Ready to execute?</h2>
          <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 20 }}>After review, say "go for it" to start portfolio wave, or "taskflow first" to redesign TaskFlow before other projects.</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <div style={{ background: "#14b8a6", color: "#fff", fontWeight: 700, padding: "10px 22px", borderRadius: 8, fontSize: 14 }}>Option A: Start portfolio wave (ai-social-content first)</div>
            <div style={{ background: "#2563eb", color: "#fff", fontWeight: 700, padding: "10px 22px", borderRadius: 8, fontSize: 14 }}>Option B: Redesign TaskFlow first</div>
            <div style={{ background: "#1e293b", color: "#94a3b8", fontWeight: 600, padding: "10px 22px", borderRadius: 8, fontSize: 14 }}>Option C: Both in parallel</div>
          </div>
        </section>

      </div>
    </div>
  )
}
