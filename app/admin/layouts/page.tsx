export default function LayoutsPage() {
  const layouts = [
    {
      id: 'T1',
      name: 'Finance / Billing',
      template: 'TEMPLATE 1',
      projects: ['invoicemint', 'trackwealth', 'billslash'],
      bg: '#f8fafc',
      accent: '#059669',
      dark: false,
      skills: ['/design-shotgun', '/frontend-design (OD)', '/design-html', '/ui-ux-pro-max', '/21st-registry', '/emil-design-eng', '/animate'],
      panel: 'Invoice fields type → status badge → confetti',
      description: 'Split lg:grid-cols-2. Left: headline+CTA. Right: invoice generator animating.',
      demo: (
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, display: 'flex', gap: 12, minHeight: 120 }}>
          <div style={{ flex: 1 }}>
            <div style={{ width: 80, height: 8, background: '#059669', borderRadius: 4, marginBottom: 8, opacity: 0.3 }} />
            <div style={{ width: '90%', height: 14, background: '#0f172a', borderRadius: 4, marginBottom: 6 }} />
            <div style={{ width: '70%', height: 10, background: '#64748b', borderRadius: 4, marginBottom: 12 }} />
            <div style={{ width: 100, height: 32, background: '#059669', borderRadius: 8 }} />
          </div>
          <div style={{ flex: 1, background: '#fff', border: '1px solid #e2e8f0', borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 10, color: '#64748b', marginBottom: 6 }}>Invoice #2024-001</div>
            <div style={{ width: '80%', height: 8, background: '#e2e8f0', borderRadius: 3, marginBottom: 4 }} />
            <div style={{ width: '60%', height: 8, background: '#e2e8f0', borderRadius: 3, marginBottom: 4 }} />
            <div style={{ width: 60, height: 20, background: '#dcfce7', border: '1px solid #059669', borderRadius: 4, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 9, color: '#059669', fontWeight: 700 }}>✓ Sent</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'T2',
      name: 'Education / Quiz',
      template: 'TEMPLATE 2',
      projects: ['quizbites', 'tutiq', 'speakiq', 'kwizzo'],
      bg: '#f0f9ff',
      accent: '#0284c7',
      dark: false,
      skills: ['/design-shotgun', '/frontend-design (OD)', '/design-html', '/ui-ux-pro-max', '/21st-registry', '/animate', '/transitions-dev'],
      panel: 'Topic types → quiz cards slide → correct lights green → score ticks',
      description: 'Split lg:grid-cols-2. Left: gamified headline. Right: quiz cards animating with score.',
      demo: (
        <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 12, padding: 16, display: 'flex', gap: 12, minHeight: 120 }}>
          <div style={{ flex: 1 }}>
            <div style={{ width: 70, height: 8, background: '#0284c7', borderRadius: 4, marginBottom: 8, opacity: 0.3 }} />
            <div style={{ width: '85%', height: 14, background: '#0f172a', borderRadius: 4, marginBottom: 6 }} />
            <div style={{ width: '65%', height: 10, background: '#64748b', borderRadius: 4, marginBottom: 12 }} />
            <div style={{ width: 110, height: 32, background: '#0284c7', borderRadius: 8 }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ background: '#fff', border: '1px solid #bae6fd', borderRadius: 8, padding: '6px 10px', fontSize: 10, color: '#0f172a' }}>What year did WW2 end?</div>
            {['1943', '1945', '1947', '1950'].map((opt, i) => (
              <div key={opt} style={{ background: i === 1 ? '#dcfce7' : '#fff', border: `1px solid ${i === 1 ? '#059669' : '#e2e8f0'}`, borderRadius: 6, padding: '4px 8px', fontSize: 9, color: i === 1 ? '#059669' : '#64748b', fontWeight: i === 1 ? 700 : 400 }}>{opt}</div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'T3',
      name: 'Productivity / SaaS',
      template: 'TEMPLATE 3',
      projects: ['replydesk', 'draftcal', 'zerostaff', 'pdfideas'],
      bg: '#ffffff',
      accent: '#2563eb',
      dark: false,
      skills: ['/frontend-design (OD)', '/shadcn-ui (OD)', '/design-html', '/ui-ux-pro-max', '/21st-registry', '/emil-design-eng', '/animate'],
      panel: 'Ticket arrives → shimmer 1.5s → AI reply types word-by-word → tone badge',
      description: 'Split lg:grid-cols-2. Clean white. Left: outcome headline. Right: before/after workflow.',
      demo: (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 16, display: 'flex', gap: 12, minHeight: 120 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: '#2563eb', fontWeight: 600, marginBottom: 8 }}>AI-Powered · Free to start</div>
            <div style={{ width: '90%', height: 14, background: '#0f172a', borderRadius: 4, marginBottom: 6 }} />
            <div style={{ width: '70%', height: 10, background: '#64748b', borderRadius: 4, marginBottom: 12 }} />
            <div style={{ width: 100, height: 32, background: '#2563eb', borderRadius: 8 }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 6, padding: '6px 8px', fontSize: 9, color: '#92400e' }}>Customer: "My order hasn't arrived after 2 weeks..."</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ flex: 1, height: 4, background: 'linear-gradient(90deg,#2563eb 60%,#e2e8f0 60%)', borderRadius: 2 }} />
              <span style={{ fontSize: 8, color: '#2563eb' }}>Drafting...</span>
            </div>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 6, padding: '6px 8px', fontSize: 9, color: '#1e40af' }}>Hi! I sincerely apologize for the delay. Let me track your order right away...</div>
            <div style={{ width: 60, height: 16, background: '#dcfce7', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 8, color: '#059669', fontWeight: 600 }}>Empathetic</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'T4',
      name: 'AI Dev Tools / Agents',
      template: 'TEMPLATE 4',
      projects: ['agenttrace', 'neuralos', 'rideflow', 'resumevault'],
      bg: '#0b1120',
      accent: '#6366f1',
      dark: true,
      skills: ['/design-shotgun', '/interface-design (OD)', '/design-html', '/ui-ux-pro-max', '/animate', '/gsap-core'],
      panel: 'Terminal log stream scrolls with timestamps + span depth bars',
      description: 'Split lg:grid-cols-2. Dark navy bg. Left: technical headline. Right: terminal/trace animation.',
      demo: (
        <div style={{ background: '#0b1120', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 12, padding: 16, display: 'flex', gap: 12, minHeight: 120 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: '#818cf8', fontFamily: 'monospace', marginBottom: 8 }}>v2.0 · Open Beta</div>
            <div style={{ width: '90%', height: 14, background: '#f8fafc', borderRadius: 4, marginBottom: 6 }} />
            <div style={{ width: '70%', height: 10, background: '#94a3b8', borderRadius: 4, marginBottom: 12 }} />
            <div style={{ width: 100, height: 32, background: '#6366f1', borderRadius: 8 }} />
          </div>
          <div style={{ flex: 1, background: '#060d1a', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 8, padding: 8, fontFamily: 'monospace' }}>
            {[
              { t: '10:42:01', m: 'agent.run started', c: '#94a3b8' },
              { t: '10:42:02', m: '→ tool_call: search()', c: '#818cf8' },
              { t: '10:42:03', m: '← result: 3 docs found', c: '#22d3ee' },
              { t: '10:42:04', m: 'agent.run complete ✓', c: '#4ade80' },
            ].map((l, i) => (
              <div key={i} style={{ fontSize: 8, color: l.c, marginBottom: 3 }}><span style={{ opacity: 0.5 }}>{l.t}</span> {l.m}</div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'T5',
      name: 'Health / Wellness',
      template: 'TEMPLATE 5',
      projects: ['myvitals', 'voicejournal', 'aicoachlab'],
      bg: '#f0fdfa',
      accent: '#0d9488',
      dark: false,
      skills: ['/frontend-design (OD)', '/theme-factory (OD)', '/design-html', '/ui-ux-pro-max', '/emil-design-eng', '/animate'],
      panel: 'Health score ring fills 0→87% → metric cards count up (steps, sleep, mood)',
      description: 'Split lg:grid-cols-2. Calm teal-tint bg. Rounded corners. Empathetic copy.',
      demo: (
        <div style={{ background: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: 12, padding: 16, display: 'flex', gap: 12, minHeight: 120 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 9, color: '#0d9488', fontWeight: 600, marginBottom: 8 }}>Personal · Free to start</div>
            <div style={{ width: '85%', height: 14, background: '#0f172a', borderRadius: 4, marginBottom: 6 }} />
            <div style={{ width: '65%', height: 10, background: '#64748b', borderRadius: 4, marginBottom: 12 }} />
            <div style={{ width: 110, height: 32, background: '#0d9488', borderRadius: 999 }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', border: '4px solid #0d9488', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0d9488' }}>87</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[['8.2k', 'Steps'], ['7h', 'Sleep'], ['😊', 'Mood']].map(([v, l]) => (
                <div key={l} style={{ background: '#fff', border: '1px solid #99f6e4', borderRadius: 6, padding: '4px 6px', textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#0d9488' }}>{v}</div>
                  <div style={{ fontSize: 8, color: '#64748b' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'T6',
      name: 'Creative / Photo / Media',
      template: 'TEMPLATE 6',
      projects: ['photorestore', 'pixelforge', 'clipforge'],
      bg: '#faf7f4',
      accent: '#c8894a',
      dark: false,
      skills: ['/design-shotgun', '/frontend-design (OD)', '/design-html', '/animate', '/transitions-dev', '/emil-design-eng'],
      panel: 'Before/after drag slider auto-sweeps — old photo left, restored right',
      description: 'Split or before/after hero. Warm cream bg (photorestore) or near-black (pixelforge).',
      demo: (
        <div style={{ background: '#faf7f4', border: '1px solid #e7e0d8', borderRadius: 12, padding: 16, display: 'flex', gap: 12, minHeight: 120 }}>
          <div style={{ flex: 1 }}>
            <div style={{ width: 70, height: 8, background: '#c8894a', borderRadius: 4, marginBottom: 8, opacity: 0.4 }} />
            <div style={{ width: '90%', height: 14, background: '#1c1917', borderRadius: 4, marginBottom: 6 }} />
            <div style={{ width: '70%', height: 10, background: '#78716c', borderRadius: 4, marginBottom: 12 }} />
            <div style={{ width: 100, height: 32, background: '#c8894a', borderRadius: 999 }} />
          </div>
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: 8, border: '1px solid #e7e0d8' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, #78716c 50%, #d6cfc8 50%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 2, height: '80%', background: '#c8894a', position: 'relative' }}>
                <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 20, height: 20, borderRadius: '50%', background: '#c8894a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 8, color: '#fff' }}>↔</span>
                </div>
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: 6, left: 6, fontSize: 8, color: '#fff', background: 'rgba(0,0,0,0.4)', borderRadius: 4, padding: '2px 5px' }}>Before</div>
            <div style={{ position: 'absolute', bottom: 6, right: 6, fontSize: 8, color: '#fff', background: 'rgba(0,0,0,0.4)', borderRadius: 4, padding: '2px 5px' }}>After</div>
          </div>
        </div>
      ),
    },
    {
      id: 'T7',
      name: 'Travel / Local / Discovery',
      template: 'TEMPLATE 7',
      projects: ['roamplan', 'anylocal', 'homecanvas'],
      bg: '#f0fdf4',
      accent: '#059669',
      dark: false,
      skills: ['/design-shotgun', '/frontend-design (OD)', '/design-html', '/ui-ux-pro-max', '/animate', '/fal-generate (hero image)'],
      panel: 'Itinerary cards fly in for destination (roamplan) / business listings appear (anylocal)',
      description: 'Full-width warm or split. Inviting, exploratory feel. Real place imagery.',
      demo: (
        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 12, padding: 16, display: 'flex', gap: 12, minHeight: 120 }}>
          <div style={{ flex: 1 }}>
            <div style={{ width: 70, height: 8, background: '#059669', borderRadius: 4, marginBottom: 8, opacity: 0.4 }} />
            <div style={{ width: '85%', height: 14, background: '#0f172a', borderRadius: 4, marginBottom: 6 }} />
            <div style={{ width: '65%', height: 10, background: '#64748b', borderRadius: 4, marginBottom: 12 }} />
            <div style={{ width: 110, height: 32, background: '#059669', borderRadius: 8 }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
            <div style={{ fontSize: 9, color: '#059669', fontWeight: 600 }}>Tokyo · 5 Days</div>
            {['Day 1 — Shinjuku & Harajuku', 'Day 2 — Akihabara & Ueno', 'Day 3 — Shibuya & Roppongi'].map((d, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #bbf7d0', borderRadius: 6, padding: '5px 8px', fontSize: 8, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontSize: 7, color: '#fff', fontWeight: 700 }}>{i + 1}</span>
                </div>
                {d}
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f8fafc', fontFamily: 'system-ui, sans-serif', padding: '40px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, color: '#6366f1', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Design System</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, marginBottom: 8 }}>Layout Templates</h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: 14 }}>
            7 layout archetypes — each with unique bg/accent, animated demo panel, and mandatory skill pipeline.
            Source: <code style={{ color: '#818cf8', fontSize: 12 }}>design-system/LAYOUT-PROMPTS.md</code> +
            <code style={{ color: '#818cf8', fontSize: 12 }}> design-system/MASTER.md</code>
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: 24 }}>
          {layouts.map(l => (
            <div key={l.id} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, background: '#1e1b4b', color: '#818cf8', borderRadius: 6, padding: '2px 8px' }}>{l.id}</span>
                    <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>{l.name}</h2>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: '#64748b' }}>{l.description}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: l.bg, border: '1px solid rgba(255,255,255,0.2)' }} title={`bg: ${l.bg}`} />
                  <div style={{ width: 24, height: 24, borderRadius: 6, background: l.accent }} title={`accent: ${l.accent}`} />
                </div>
              </div>

              {/* Preview */}
              {l.demo}

              {/* Projects */}
              <div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Projects</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {l.projects.map(p => (
                    <span key={p} style={{ fontSize: 11, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: '3px 8px', color: '#cbd5e1' }}>{p}</span>
                  ))}
                </div>
              </div>

              {/* Animated panel description */}
              <div style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 8, padding: '8px 12px' }}>
                <div style={{ fontSize: 10, color: '#818cf8', fontWeight: 600, marginBottom: 3 }}>▶ Animated Right Panel</div>
                <div style={{ fontSize: 12, color: '#c7d2fe' }}>{l.panel}</div>
              </div>

              {/* Skills pipeline */}
              <div>
                <div style={{ fontSize: 11, color: '#64748b', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Skill Pipeline (in order)</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {l.skills.map((s, i) => (
                    <span key={s} style={{ fontSize: 10, background: 'rgba(34,211,238,0.08)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 5, padding: '2px 7px', color: '#67e8f9', fontFamily: 'monospace' }}>
                      {i + 1}. {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div style={{ marginTop: 40, padding: 20, background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 12 }}>
          <div style={{ fontSize: 13, color: '#a5b4fc', fontWeight: 600, marginBottom: 8 }}>How to use this page</div>
          <ol style={{ margin: 0, paddingLeft: 20, color: '#94a3b8', fontSize: 12, lineHeight: 1.8 }}>
            <li>Pick layout template matching project category</li>
            <li>Copy prompt from <code style={{ color: '#818cf8' }}>design-system/LAYOUT-PROMPTS.md</code></li>
            <li>Fill in project name, tagline, CTA, bg/accent hex</li>
            <li>Run the skill pipeline shown above IN ORDER</li>
            <li>Animated right panel = mandatory, never static</li>
            <li>Before push: Playwright 375px + 1280px screenshots</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
