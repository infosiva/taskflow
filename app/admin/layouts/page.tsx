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
    // ── T8–T17 NEW ARCHETYPES ──────────────────────────────────────────────
    {
      id: 'T8',
      name: 'Swiss Editorial Grid',
      template: 'TEMPLATE 8',
      projects: ['worldtrends', 'mandirates'],
      bg: '#f9fafb', accent: '#dc2626', dark: false,
      skills: ['/swiss-creative-mode-template (OD)', '/digits-fintech-swiss-template (OD)', '/d3-visualization', '/gsap-core'],
      panel: 'Full-width — large metric numbers count up 0→value on load. No split.',
      description: '12-col strict grid. Full-width. Large type. Metric cards row. Data IS the hero.',
      demo: (
        <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16, minHeight: 120 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#0a0a0a', letterSpacing: '-0.03em', marginBottom: 4 }}>Market prices. Real time.</div>
          <div style={{ width: '60%', height: 1, background: '#dc2626', marginBottom: 12 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
            {[['₹2,840', 'Wheat/q'], ['₹4,120', 'Rice/q'], ['↑ 3.2%', 'Avg rise']].map(([v, l]) => (
              <div key={l} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: '8px 10px' }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#0a0a0a', fontVariantNumeric: 'tabular-nums' }}>{v}</div>
                <div style={{ fontSize: 9, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'T9',
      name: 'Bento Grid Dashboard',
      template: 'TEMPLATE 9',
      projects: ['meetscribe', 'weekendai', 'zerostaff'],
      bg: '#ffffff', accent: '#0ea5e9', dark: false,
      skills: ['/shadcn-ui (OD)', '/ui-skills (OD)', '/animate', '/transitions-dev'],
      panel: 'Mosaic of unequal cards — cells stagger-enter, hover lifts 4px.',
      description: 'Bento mosaic above fold. No split hero. Grid IS the layout. Cards show live product snippets.',
      demo: (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 12, minHeight: 120 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridTemplateRows: 'auto auto', gap: 8 }}>
            <div style={{ gridColumn: '1', gridRow: '1 / span 2', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>Meet notes, instantly.</div>
              <div style={{ fontSize: 9, color: '#64748b', marginBottom: 8 }}>AI transcribes + summarises every meeting</div>
              <div style={{ width: 80, height: 24, background: '#0ea5e9', borderRadius: 6 }} />
            </div>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 9, color: '#059669', fontWeight: 600 }}>Last meeting</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>Q2 Planning</div>
              <div style={{ fontSize: 8, color: '#64748b' }}>8 action items</div>
            </div>
            <div style={{ background: '#fefce8', border: '1px solid #fef08a', borderRadius: 10, padding: 10 }}>
              <div style={{ fontSize: 9, color: '#ca8a04', fontWeight: 600 }}>This week</div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', marginTop: 2 }}>4 meetings</div>
              <div style={{ fontSize: 8, color: '#64748b' }}>saved 3.2h</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'T10',
      name: 'Cinematic Full-Bleed',
      template: 'TEMPLATE 10',
      projects: ['clipforge', 'nammatamil', 'ninjapa'],
      bg: '#0a0a0f', accent: '#e879f9', dark: true,
      skills: ['/after-hours-editorial-template (OD)', '/gsap-scrolltrigger', '/fal-kling-o3'],
      panel: 'Full-viewport video/generative bg. Content centered on dark overlay. Scroll scrubs video.',
      description: 'Full-bleed hero. Video or generative canvas bg. Dark overlay. Centered text. Scroll-driven.',
      demo: (
        <div style={{ background: 'linear-gradient(135deg,#0a0a0f 0%,#1a0a2e 50%,#0a0a0f 100%)', border: '1px solid rgba(232,121,249,0.2)', borderRadius: 12, padding: 16, minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(232,121,249,0.08) 0%, transparent 70%)' }} />
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: 8, color: '#e879f9', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>AI Video Editing</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}>Cut. Create. Ship.</div>
            <div style={{ width: 80, height: 24, background: '#e879f9', borderRadius: 6, margin: '0 auto' }} />
          </div>
          <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: 'rgba(255,255,255,0.4)' }}>↓ scroll</div>
        </div>
      ),
    },
    {
      id: 'T11',
      name: 'Typewriter Terminal (Centered)',
      template: 'TEMPLATE 11',
      projects: ['neuralos', 'ninjapa', 'rideflow'],
      bg: '#060d1a', accent: '#22d3ee', dark: true,
      skills: ['/interface-design (OD)', '/gsap-timeline', '/animate'],
      panel: 'Terminal lines appear one-by-one. Cursor blinks. CTA fades in after sequence. No split.',
      description: 'Single centered column. Terminal sequence IS the demo. No right panel.',
      demo: (
        <div style={{ background: '#060d1a', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 12, padding: 16, minHeight: 120 }}>
          <div style={{ textAlign: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 8, color: '#22d3ee', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>AI Infrastructure</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#f8fafc' }}>Run agents in production.</div>
          </div>
          <div style={{ background: '#030712', border: '1px solid rgba(34,211,238,0.15)', borderRadius: 8, padding: '10px 12px', fontFamily: 'monospace' }}>
            {[
              { c: '#94a3b8', t: '$ initializing neuralos agent...' },
              { c: '#22d3ee', t: '✓ connected to orchestrator' },
              { c: '#4ade80', t: '$ running task: analyze_logs' },
              { c: '#f8fafc', t: '█' },
            ].map((l, i) => <div key={i} style={{ fontSize: 9, color: l.c, marginBottom: 3 }}>{l.t}</div>)}
          </div>
        </div>
      ),
    },
    {
      id: 'T12',
      name: 'Magazine Editorial',
      template: 'TEMPLATE 12',
      projects: ['nammatamil', 'bookingcall'],
      bg: '#fffbf5', accent: '#f97316', dark: false,
      skills: ['/field-notes-editorial-template (OD)', '/editorial-burgundy-principles-template (OD)', '/gsap-scrolltrigger', '/emil-design-eng'],
      panel: 'Serif headline. 2-col editorial grid. Masonry service/topic cards stagger on scroll.',
      description: 'Newspaper/magazine feel. Playfair Display serif. Editorial column layout. Warm paper bg.',
      demo: (
        <div style={{ background: '#fffbf5', border: '1px solid #fed7aa', borderRadius: 12, padding: 16, minHeight: 120 }}>
          <div style={{ borderBottom: '1px solid #f97316', paddingBottom: 6, marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 8, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>Tamil Culture</span>
            <span style={{ fontSize: 8, color: '#9a7b5a' }}>June 2026</span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#1c0a00', fontStyle: 'italic', lineHeight: 1.2, marginBottom: 8 }}>Stories that bind us together.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {['Cinema', 'Music', 'Culture'].map(t => (
              <div key={t} style={{ background: '#fff', border: '1px solid #fed7aa', borderRadius: 6, padding: '6px 8px', fontSize: 9, color: '#1c0a00', fontWeight: 600 }}>{t}</div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: 'T13',
      name: 'Floating Cards / Orbit',
      template: 'TEMPLATE 13',
      projects: ['aicoachlab', 'weekendai', 'playsmart'],
      bg: '#fff7ed', accent: '#ea580c', dark: false,
      skills: ['/design-shotgun', '/algorithmic-art (OD)', '/animate', '/emil-design-eng'],
      panel: 'Feature cards float at angles around centered headline. Drift animation. Hover snaps to grid.',
      description: 'Center headline + CTA. Topic/feature cards orbit at random rotations. Subtle drift.',
      demo: (
        <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: 16, minHeight: 120, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {[
            { label: 'Interview Prep', top: 10, left: 10, rot: -8 },
            { label: 'Resume Review', top: 10, right: 10, rot: 6 },
            { label: 'Salary Negotiation', bottom: 10, left: 10, rot: 5 },
            { label: 'Career Switch', bottom: 10, right: 10, rot: -7 },
          ].map((c, i) => (
            <div key={i} style={{ position: 'absolute', top: c.top, left: c.left, bottom: c.bottom, right: c.right, background: '#fff', border: '1px solid #fed7aa', borderRadius: 8, padding: '5px 9px', fontSize: 9, fontWeight: 600, color: '#431407', transform: `rotate(${c.rot}deg)`, boxShadow: '0 2px 8px rgba(234,88,12,0.1)' }}>{c.label}</div>
          ))}
          <div style={{ textAlign: 'center', zIndex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1c0a00', marginBottom: 6 }}>Your AI career coach</div>
            <div style={{ width: 80, height: 24, background: '#ea580c', borderRadius: 6, margin: '0 auto' }} />
          </div>
        </div>
      ),
    },
    {
      id: 'T14',
      name: 'Generative Art Background',
      template: 'TEMPLATE 14',
      projects: ['pixelforge', 'playsmart', 'clipforge'],
      bg: '#0e0e16', accent: '#a78bfa', dark: true,
      skills: ['/shader-dev (OD)', '/algorithmic-art (OD)', '/threejs (OD)', '/animate'],
      panel: 'WebGL/canvas procedural bg unique per visit. Responds to mouse. Content overlaid.',
      description: 'Full-viewport generative canvas behind content. SSR-safe. prefers-reduced-motion static fallback.',
      demo: (
        <div style={{ background: '#0e0e16', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 12, padding: 16, minHeight: 120, position: 'relative', overflow: 'hidden' }}>
          {/* Fake pixel grid */}
          <div style={{ position: 'absolute', inset: 0, display: 'grid', gridTemplateColumns: 'repeat(12,1fr)', gridTemplateRows: 'repeat(6,1fr)', gap: 1, opacity: 0.3 }}>
            {Array.from({ length: 72 }).map((_, i) => (
              <div key={i} style={{ background: i % 7 === 0 ? '#a78bfa' : i % 5 === 0 ? '#7c3aed' : i % 3 === 0 ? '#4c1d95' : 'transparent', borderRadius: 1 }} />
            ))}
          </div>
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', paddingTop: 16 }}>
            <div style={{ fontSize: 8, color: '#a78bfa', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>Pixel Art Studio</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 8 }}>Create. Play. Ship.</div>
            <div style={{ width: 80, height: 24, background: '#a78bfa', borderRadius: 6 }} />
          </div>
        </div>
      ),
    },
    {
      id: 'T15',
      name: 'D3 Live Data Hero',
      template: 'TEMPLATE 15',
      projects: ['trackwealth', 'mandirates', 'agenttrace'],
      bg: '#0b1420', accent: '#f59e0b', dark: true,
      skills: ['/d3-visualization (OD)', '/gsap-core', '/animate'],
      panel: 'D3 chart IS the right panel. Line/bar chart animates in on mount. Updates every 5s.',
      description: 'Split hero but right panel = live D3 chart. Chart draws on mount. Real/seed data.',
      demo: (
        <div style={{ background: '#0b1420', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, padding: 16, display: 'flex', gap: 12, minHeight: 120 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 8, color: '#f59e0b', fontWeight: 600, marginBottom: 6 }}>Portfolio Analytics</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#f8fafc', marginBottom: 4 }}>Track every penny.</div>
            <div style={{ fontSize: 9, color: '#94a3b8', marginBottom: 10 }}>Real-time portfolio tracking</div>
            <div style={{ width: 80, height: 24, background: '#f59e0b', borderRadius: 6 }} />
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 2 }}>
            {/* Mini bar chart */}
            {[40, 55, 35, 70, 60, 85, 75].map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-end', gap: 2 }}>
                <div style={{ width: `${h}%`, height: 8, background: i === 6 ? '#f59e0b' : 'rgba(245,158,11,0.3)', borderRadius: 2 }} />
              </div>
            ))}
            <div style={{ fontSize: 8, color: '#f59e0b', marginTop: 4, fontFamily: 'monospace' }}>+18.4% this month</div>
          </div>
        </div>
      ),
    },
    {
      id: 'T16',
      name: 'Full-Width Input Hero',
      template: 'TEMPLATE 16',
      projects: ['speakiq', 'resumevault', 'pdfideas'],
      bg: '#fdf4ff', accent: '#9333ea', dark: false,
      skills: ['/frontend-design (OD)', '/shadcn-ui (OD)', '/transitions-dev', '/animate'],
      panel: 'Giant input IS the hero. Placeholder cycles queries (typewriter). Real API on submit. Result slides in below.',
      description: 'Single centered column. No split. Input bar dominates. Core action zero-auth inline.',
      demo: (
        <div style={{ background: '#fdf4ff', border: '1px solid #e9d5ff', borderRadius: 12, padding: 16, minHeight: 120 }}>
          <div style={{ textAlign: 'center', marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#1e1b4b', marginBottom: 4 }}>Speak any language.</div>
          </div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
            <div style={{ flex: 1, background: '#fff', border: '2px solid #9333ea', borderRadius: 10, padding: '8px 12px', fontSize: 10, color: '#6b21a8' }}>Type a word in any language...</div>
            <div style={{ width: 36, height: 36, background: '#9333ea', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#fff', fontSize: 12 }}>→</span>
            </div>
          </div>
          <div style={{ background: '#f3e8ff', border: '1px solid #d8b4fe', borderRadius: 8, padding: '8px 12px' }}>
            <div style={{ fontSize: 9, color: '#7e22ce', fontWeight: 600 }}>Pronunciation: /bonjuːr/</div>
            <div style={{ fontSize: 8, color: '#6b21a8', marginTop: 2 }}>French → "Good day" — Formal greeting, used morning to evening</div>
          </div>
        </div>
      ),
    },
    {
      id: 'T17',
      name: 'Asymmetric Split (60/40)',
      template: 'TEMPLATE 17',
      projects: ['quizbytesdaily', 'replydesk', 'draftcal'],
      bg: '#f0f9ff', accent: '#7c3aed', dark: false,
      skills: ['/ui-skills (OD)', '/frontend-design (OD)', '/gsap-scrolltrigger', '/animate', '/transitions-dev'],
      panel: 'Dominant side (3fr) = product demo sticky. Minor side (2fr) = headline scrolls past.',
      description: 'lg:grid-cols-[3fr_2fr] or [2fr_3fr]. One side dominates visually. Not equal columns.',
      demo: (
        <div style={{ background: '#f0f9ff', border: '1px solid #c7d2fe', borderRadius: 12, padding: 12, minHeight: 120, display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 8 }}>
          {/* Dominant — quiz card */}
          <div style={{ background: '#fff', border: '2px solid #7c3aed', borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 9, color: '#7c3aed', fontWeight: 600, marginBottom: 6 }}>Daily Quiz — June 17</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Who wrote Hamlet?</div>
            {['Marlowe', 'Shakespeare', 'Chaucer', 'Milton'].map((o, i) => (
              <div key={o} style={{ background: i === 1 ? '#ede9fe' : '#f8fafc', border: `1px solid ${i === 1 ? '#7c3aed' : '#e2e8f0'}`, borderRadius: 6, padding: '4px 8px', fontSize: 9, color: i === 1 ? '#7c3aed' : '#64748b', marginBottom: 3, fontWeight: i === 1 ? 600 : 400 }}>{o}</div>
            ))}
          </div>
          {/* Minor — copy */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>One quiz. Every day.</div>
            <div style={{ fontSize: 9, color: '#64748b', marginBottom: 8 }}>Sharpen your mind in 2 minutes</div>
            <div style={{ width: 70, height: 24, background: '#7c3aed', borderRadius: 6 }} />
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
          <h1 style={{ fontSize: 28, fontWeight: 700, margin: 0, marginBottom: 8 }}>Layout Templates — T1 to T17</h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: 14 }}>
            17 layout archetypes — each with unique bg/accent, animated demo panel, and mandatory skill pipeline.
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
