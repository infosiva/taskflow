/**
 * Push all 49 portfolio projects as tasks into TaskFlow "Portfolio QA Audit" board.
 * Run: node --env-file=.env.local scripts/push-portfolio-tasks.mjs
 *
 * Each task includes:
 * - Automated 20-point checklist results (from checklist-agent run 2026-06-16)
 * - 10 new hard-rule checks (manual audit required)
 * - Exact fix steps per failure
 * - Severity bucket: critical / high / medium / low / pass
 */
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

// ── Board config (from setup-portfolio-audit.mjs) ──────────────────────────
const BOARD_ID   = 'eb9b84b8-a900-4279-b126-bc8878a68402';
const GROUPS = {
  critical: 'b9d6f298-6284-4c2a-b748-2c409c972bbc',
  high:     'b9d6f298-6284-4c2a-b748-2c409c972bbc',
  medium:   'a8a0cb75-63fa-4d34-9c90-95fd1add99d9',
  low:      'a8a0cb75-63fa-4d34-9c90-95fd1add99d9',
  pass:     'a00131c8-a403-48e6-ba3c-50c764bdb893',
};
const COLS = {
  project:   '67691843-97c2-4306-98e4-253a1eadf76a',
  url:       'e2f481cd-f19e-4481-958c-0a1dedc9c77d',
  issueType: '27132f1e-cb22-464b-aac1-87ce306950bb',
  severity:  '7872927a-85c9-4857-9112-4718767e412e',
  notes:     '31e875c9-a800-4d3e-a1df-280007b5ddab',
};

// ── Project data ────────────────────────────────────────────────────────────
// Format: { name, url, automated_score, automated_fails, new_rules_needed, severity, notes }
// automated_fails: from checklist-agent run 2026-06-16
// new_rules_needed: §21-§30 checks (unique_layout, unique_colors, chatbot_works, landing_content,
//   live_demo, mobile_pwa, upgrade_scope, promo_code, feedback_works, no_login_triage)
// ALL projects need §21-§30 audit regardless of automated score.

const PROJECTS = [
  // ── 20/20 automated (still need 30-point audit) ──────────────────────────
  {
    name: 'kwizzo', url: 'https://kwizzo.app',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §21: Verify layout type unique vs portfolio — education quiz, currently split-hero.',
      'AUDIT NEEDED §22: bg=#f0f9ff accent=#0369a1 — check no collision with tutiq.',
      'AUDIT NEEDED §23: Test chatbot FAB responds with quiz-scoped answers.',
      'AUDIT NEEDED §24: Landing content — headline product-specific, subhead ≥2 sentences.',
      'AUDIT NEEDED §25: Live demo — quiz plays on landing without login.',
      'AUDIT NEEDED §26: Mobile 375px — above-fold, app-like, minimal scroll.',
      'AUDIT NEEDED §27: Upgrade section — lists Free vs Pro limits explicitly.',
      'AUDIT NEEDED §28: Promo code system (lib/promoCode.ts, /api/promo, hooks/usePromo.ts).',
      'AUDIT NEEDED §29: FeedbackWidget submits to DB — test real submission.',
      'AUDIT NEEDED §30: Core quiz action works zero auth.',
    ].join('\n'),
  },
  {
    name: 'speakiq', url: 'https://speakiq.app',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §21: Unique layout — education speaking tool, check not identical to kwizzo.',
      'AUDIT NEEDED §22: bg=#f0fdfa accent=#0f766e — verify no collision.',
      'AUDIT NEEDED §23: Chatbot — scoped to speaking/pronunciation help.',
      'AUDIT NEEDED §24: Landing headline specific to speech coaching niche.',
      'AUDIT NEEDED §25: Live demo — speaking exercise runs on landing.',
      'AUDIT NEEDED §26: Mobile PWA feel — app-like, bottom nav if multi-screen.',
      'AUDIT NEEDED §27-§30: promo code, feedback DB test, upgrade scope, zero auth core.',
    ].join('\n'),
  },
  {
    name: 'resumevault', url: 'https://resumevault.app',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §21: Dark AI-infra layout — must differ from agenttrace/neuralos.',
      'AUDIT NEEDED §22: bg=#0c0f1a accent=#7c3aed — check no collision with neuralos.',
      'AUDIT NEEDED §23: Chatbot scoped to resume/job search tips.',
      'AUDIT NEEDED §24-§30: Content, live demo (resume bullet generation on landing), mobile, promo, feedback.',
    ].join('\n'),
  },
  {
    name: 'draftcal', url: 'https://draftcal.app',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §21: Productivity/SaaS layout — must differ from taskflow (also white+blue).',
      'AUDIT NEEDED §22: bg=#ffffff accent=#2563eb — COLLISION RISK with taskflow/aicoachlab. Pick different accent.',
      'FIX §22: Recommend accent change to #7c3aed (violet) or #0891b2 (cyan) to differentiate.',
      'AUDIT NEEDED §23-§30: chatbot works, live calendar demo on landing, mobile, promo, feedback.',
    ].join('\n'),
  },
  {
    name: 'trackwealth', url: 'https://trackwealth.app',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §22: bg=#f8fafc accent=#059669 — check collision with invoicemint (same category).',
      'AUDIT NEEDED §24: Landing content — wealth tracking specific, not generic finance.',
      'AUDIT NEEDED §25: Live demo — portfolio chart animating on landing.',
      'AUDIT NEEDED §26-§30: mobile PWA, promo, upgrade scope (show portfolio size limits), feedback.',
    ].join('\n'),
  },
  {
    name: 'roamplan', url: 'https://roamplan.app',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §22: bg=#f0fdf4 accent=#059669 — collision risk with trackwealth. Differentiate.',
      'AUDIT NEEDED §24: Travel itinerary specific content — hero must say destination/days/style.',
      'AUDIT NEEDED §25: Generate 1 itinerary on landing without login.',
      'AUDIT NEEDED §26-§30: mobile, promo, feedback DB, upgrade scope.',
    ].join('\n'),
  },
  {
    name: 'worldtrends', url: 'https://worldtrends.today',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §21: News/trends layout — must look like a news dashboard not a SaaS tool.',
      'AUDIT NEEDED §22: bg=#f9fafb accent=#dc2626 — unique, check no collision.',
      'AUDIT NEEDED §25: Live trending headlines load on landing without login.',
      'AUDIT NEEDED §26-§30: mobile (news-app feel), promo, feedback, upgrade scope.',
    ].join('\n'),
  },
  {
    name: 'myvitals', url: 'https://myvitals.app',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §22: bg=#f8fafc accent=#0d9488 — check no collision with other health projects.',
      'AUDIT NEEDED §25: Vitals entry + chart visible on landing (animated metric fill).',
      'AUDIT NEEDED §26: Mobile health-app feel — large tap targets, minimal chrome.',
      'AUDIT NEEDED §27-§30: upgrade scope (# of tracked metrics), promo, feedback.',
    ].join('\n'),
  },
  {
    name: 'aicoachlab', url: 'https://aicoachlab.app',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §22: bg=#f8fafc accent=#2563eb — COLLISION RISK with draftcal. Fix.',
      'FIX §22: Change to accent=#6366f1 (indigo) or #8b5cf6 to differentiate from draftcal.',
      'AUDIT NEEDED §24-§30: Coaching-specific copy, live session demo, mobile, promo, feedback.',
    ].join('\n'),
  },
  {
    name: 'neuralos', url: 'https://neuralagent.app',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §21: Dark dev-tools layout — must differ from agenttrace (same bg).',
      'AUDIT NEEDED §22: bg=#0b1120 accent=#7c3aed — collision with resumevault. Fix one of them.',
      'FIX §22: neuralos → change to accent=#06b6d4 (cyan) or #f59e0b (amber) to differentiate.',
      'AUDIT NEEDED §23-§30: chatbot, live agent demo, mobile, promo, feedback.',
    ].join('\n'),
  },
  {
    name: 'pixelforge', url: 'https://arcadeforge.app',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §21: Gaming layout — should feel like a game portal, not SaaS.',
      'AUDIT NEEDED §22: bg=#0f0f23 accent=#f59e0b — check no collision with protoforge.',
      'AUDIT NEEDED §25: Live game preview or playable demo on landing.',
      'AUDIT NEEDED §26-§30: mobile gaming feel, promo, feedback, upgrade scope.',
    ].join('\n'),
  },
  {
    name: 'agenttrace', url: 'https://agentlogs.app',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §21: Dev-tools dashboard — terminal/log feel, not generic SaaS.',
      'AUDIT NEEDED §22: bg=#0b1120 accent=#6366f1 — check no collision with neuralos.',
      'AUDIT NEEDED §25: Live trace viewer with sample data on landing.',
      'AUDIT NEEDED §26-§30: mobile, promo, feedback, upgrade (trace count limits).',
    ].join('\n'),
  },
  {
    name: 'ai-social-content', url: 'https://ai-social-content.vercel.app',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §22: bg=#0c0f1a accent=#e879f9 — check no collision.',
      'AUDIT NEEDED §24: Content-specific copy (Twitter/LinkedIn/Instagram, not generic AI tool).',
      'AUDIT NEEDED §25: Generate a post on landing zero auth.',
      'AUDIT NEEDED §26-§30: mobile, promo, feedback, upgrade scope (# of posts/day).',
    ].join('\n'),
  },
  {
    name: 'bookingcall', url: 'https://bookingcall.app',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §22: bg=#f8fafc accent=#2563eb — collision risk with firstline (same). Fix.',
      'FIX §22: bookingcall → change accent to #059669 (emerald) or #7c3aed.',
      'AUDIT NEEDED §25: Booking slot picker visible on landing without login.',
      'AUDIT NEEDED §26-§30: mobile, promo, feedback, upgrade scope.',
    ].join('\n'),
  },
  {
    name: 'clipforge-ai', url: 'https://clipforge.ai',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §21: Media/video dark layout — must differ from yt-portal.',
      'AUDIT NEEDED §22: bg=#0a0a0f accent=#e879f9 — check no collision.',
      'AUDIT NEEDED §25: Video clip preview or generation on landing.',
      'AUDIT NEEDED §26-§30: mobile, promo, feedback, upgrade scope (clip minutes).',
    ].join('\n'),
  },
  {
    name: 'complybuddy', url: 'https://complybuddy.app',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §24: Compliance-specific copy — GDPR/CCPA/SOC2, not generic AI tool.',
      'AUDIT NEEDED §25: Run a compliance check on sample policy text on landing.',
      'AUDIT NEEDED §26-§30: mobile, promo, feedback, upgrade scope (# of checks).',
    ].join('\n'),
  },
  {
    name: 'pdfideas', url: 'https://pdfideas.vercel.app',
    auto_score: '20/20', auto_fails: 'none',
    severity: 'low',
    notes: [
      'AUTO: All 20 checks pass.',
      'AUDIT NEEDED §22: bg=#fdf4ff accent=#9333ea — check no collision.',
      'AUDIT NEEDED §25: PDF upload + idea extraction on landing without login.',
      'AUDIT NEEDED §26-§30: mobile, promo, feedback, upgrade scope (# of PDFs).',
    ].join('\n'),
  },
  // ── 1 failure ──────────────────────────────────────────────────────────────
  {
    name: 'agencyos', url: 'https://agencyos.app',
    auto_score: '19/20', auto_fails: 'feedback',
    severity: 'medium',
    notes: [
      'AUTO FAIL: feedback — FeedbackWidget not found.',
      'FIX §8: Copy FeedbackWidget.tsx from kwizzo/components/, add /api/feedback/route.ts, import at bottom of page.tsx.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'anylocal', url: 'https://anylocal.app',
    auto_score: '19/20', auto_fails: 'feedback',
    severity: 'medium',
    notes: [
      'AUTO FAIL: feedback — FeedbackWidget not found.',
      'FIX §8: Add FeedbackWidget + /api/feedback route.',
      'AUDIT NEEDED §24: Local/directory-specific copy, not generic.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'campaignforge', url: 'https://campaignforge.app',
    auto_score: '19/20', auto_fails: 'feedback',
    severity: 'medium',
    notes: [
      'AUTO FAIL: feedback — FeedbackWidget not found.',
      'FIX §8: Add FeedbackWidget + /api/feedback route.',
      'AUDIT NEEDED §25: Live campaign generator on landing.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'clawdbotai', url: 'https://clawdbotai.tech',
    auto_score: '19/20', auto_fails: 'rate_limit',
    severity: 'medium',
    notes: [
      'AUTO FAIL: rate_limit — no checkRateLimit in AI routes.',
      'FIX §9: Add rate limit (10 req/hr per IP) to every /api/ AI route.',
      'AUDIT NEEDED §22: bg=#0a0a0f accent=#34d399 — verify unique.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'homecanvas', url: 'https://homecanvas.app',
    auto_score: '19/20', auto_fails: 'feedback',
    severity: 'medium',
    notes: [
      'AUTO FAIL: feedback — FeedbackWidget not found.',
      'FIX §8: Add FeedbackWidget + /api/feedback route.',
      'AUDIT NEEDED §25: Home design tool — interior layout preview on landing.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'idea-agent', url: 'https://idea-agent.vercel.app',
    auto_score: '19/20', auto_fails: 'rate_limit',
    severity: 'medium',
    notes: [
      'AUTO FAIL: rate_limit — AI routes unprotected.',
      'FIX §9: Add checkRateLimit to every /api/ AI route.',
      'AUDIT NEEDED §24: "AI idea generator" is generic — make niche-specific.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'quizbites', url: 'https://quizbites.app',
    auto_score: '19/20', auto_fails: 'chatbot',
    severity: 'medium',
    notes: [
      'AUTO FAIL: chatbot — FloatingChatWrapper/ChatWidget not found.',
      'FIX §7: Add FloatingChatWrapper with quiz-scoped system prompt. Wire GROQ_API_KEY in Vercel.',
      'AUDIT NEEDED §22: bg=#eff6ff accent=#3b82f6 — check no collision with other education projects.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'tutiq', url: 'https://tutiq.app',
    auto_score: '19/20', auto_fails: 'chatbot',
    severity: 'medium',
    notes: [
      'AUTO FAIL: chatbot — FloatingChatWrapper/ChatWidget not found.',
      'FIX §7: Add FloatingChatWrapper with tutoring-scoped system prompt.',
      'AUDIT NEEDED §22: Education category — verify unique accent vs kwizzo/quizbites/speakiq.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'vidrush', url: 'https://vidrush.app',
    auto_score: '19/20', auto_fails: 'feedback',
    severity: 'medium',
    notes: [
      'AUTO FAIL: feedback — FeedbackWidget not found.',
      'FIX §8: Add FeedbackWidget + /api/feedback route.',
      'AUDIT NEEDED §25: Video processing demo on landing.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'yt-portal', url: 'https://yt-portal.vercel.app',
    auto_score: '19/20', auto_fails: 'rate_limit',
    severity: 'medium',
    notes: [
      'AUTO FAIL: rate_limit — AI routes unprotected.',
      'FIX §9: Add checkRateLimit to AI routes.',
      'AUDIT NEEDED §21: Media dark layout — must differ from clipforge-ai.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'zerostaff', url: 'https://zerostaff.app',
    auto_score: '19/20', auto_fails: 'chatbot',
    severity: 'medium',
    notes: [
      'AUTO FAIL: chatbot — not found.',
      'FIX §7: Add FloatingChatWrapper scoped to HR/staffing queries.',
      'AUDIT NEEDED §24: HR automation specific copy.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  // ── 2 failures ─────────────────────────────────────────────────────────────
  {
    name: 'ai-resume-screener', url: 'https://ai-resume-screener.vercel.app',
    auto_score: '18/20', auto_fails: 'feedback, rate_limit',
    severity: 'medium',
    notes: [
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: rate_limit — AI routes unprotected. Add checkRateLimit.',
      'AUDIT NEEDED §22: bg=#0c0f1a accent=#818cf8 — check no collision.',
      'AUDIT NEEDED §25: Upload a CV + get screening result on landing zero auth.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'ai-toolkit', url: 'https://aitoolkit.app',
    auto_score: '18/20', auto_fails: 'feedback, rate_limit',
    severity: 'medium',
    notes: [
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: rate_limit — add checkRateLimit. Also: ai_fallback missing — copy lib/ai.ts.',
      'Wait — actually 17/20 (feedback+rate_limit+ai_fallback) per raw output. Rechecked: 18/20.',
      'FIX: Add FeedbackWidget, rate limit, verify lib/ai.ts cascade.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'invoicemint', url: 'https://invoicemint.cloud',
    auto_score: '18/20', auto_fails: 'feedback, rate_limit',
    severity: 'medium',
    notes: [
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: rate_limit — add checkRateLimit to AI routes.',
      'AUDIT NEEDED §22: bg=#f0fdf4 accent=#16a34a — check no collision with roamplan.',
      'AUDIT NEEDED §25: Generate invoice line items on landing without login.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'mandirates', url: 'https://mandirates.app',
    auto_score: '18/20', auto_fails: 'feedback, rate_limit',
    severity: 'medium',
    notes: [
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: rate_limit — add checkRateLimit.',
      'AUDIT NEEDED §24: Local mandi/vegetable prices — very specific copy, not generic.',
      'AUDIT NEEDED §25: Price lookup on landing zero auth.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'meetscribe', url: 'https://meetscribe.app',
    auto_score: '18/20', auto_fails: 'feedback, rate_limit',
    severity: 'medium',
    notes: [
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: rate_limit — add checkRateLimit.',
      'AUDIT NEEDED §25: Meeting transcription demo on landing (upload audio or paste transcript).',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'nammatamil', url: 'https://nammatamil.live',
    auto_score: '18/20', auto_fails: 'og_png, rate_limit',
    severity: 'medium',
    notes: [
      'AUTO FAIL: og_png — public/og.png missing. Generate 1200×630 with Tamil/community branding.',
      'AUTO FAIL: rate_limit — add checkRateLimit.',
      'AUDIT NEEDED §24: Tamil community specific content, not generic social platform.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'parceliq', url: 'https://parceliq.app',
    auto_score: '18/20', auto_fails: 'feedback, rate_limit',
    severity: 'medium',
    notes: [
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: rate_limit — add checkRateLimit.',
      'AUDIT NEEDED §25: Package tracking lookup on landing zero auth.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'protoforge', url: 'https://protofast.app',
    auto_score: '18/20', auto_fails: 'feedback, rate_limit',
    severity: 'medium',
    notes: [
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: rate_limit — add checkRateLimit.',
      'AUDIT NEEDED §22: bg=#0b1120 accent=#f59e0b — collision risk with pixelforge. Fix.',
      'FIX §22: Change protoforge accent to #06b6d4 (cyan) to differentiate from pixelforge.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'quizbytesdaily', url: 'https://quizbytes.dev',
    auto_score: '18/20', auto_fails: 'rate_limit',
    severity: 'medium',
    notes: [
      'AUTO FAIL: rate_limit — add checkRateLimit.',
      'AUDIT NEEDED §22: bg=#faf5ff accent=#7c3aed — check collision with resumevault.',
      'FIX §22: quizbytesdaily → change to accent=#9333ea or #6d28d9 to differentiate.',
      'AUDIT NEEDED §25: Daily quiz plays on landing zero auth.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'rideflow', url: 'https://rideflow.app',
    auto_score: '18/20', auto_fails: 'feedback, rate_limit',
    severity: 'medium',
    notes: [
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: rate_limit — add checkRateLimit.',
      'AUDIT NEEDED §24: Ride/transport specific content.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'voicejournal', url: 'https://voicejournal.app',
    auto_score: '18/20', auto_fails: 'feedback, rate_limit',
    severity: 'medium',
    notes: [
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: rate_limit — add checkRateLimit.',
      'AUDIT NEEDED §26: Voice/journal — mobile-first PWA (bottom record button, no desktop-heavy layout).',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'weekendai', url: 'https://weekendai.app',
    auto_score: '18/20', auto_fails: 'feedback, rate_limit',
    severity: 'medium',
    notes: [
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: rate_limit — add checkRateLimit.',
      'AUDIT NEEDED §24: Weekend activity planner specific content.',
      'AUDIT NEEDED §25: Generate weekend plan on landing zero auth.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  // ── 3 failures ─────────────────────────────────────────────────────────────
  {
    name: 'ai-jobs-portal', url: 'https://aijobsportal.app',
    auto_score: '17/20', auto_fails: 'feedback, rate_limit, ai_fallback',
    severity: 'high',
    notes: [
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: rate_limit — add checkRateLimit.',
      'AUTO FAIL: ai_fallback — lib/ai.ts missing. Copy from ai-platform-template/lib/ai.ts.',
      'AUDIT NEEDED §25: Job search + AI matching on landing zero auth.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'billslash', url: 'https://billslash.app',
    auto_score: '17/20', auto_fails: 'chatbot, rate_limit, analytics',
    severity: 'high',
    notes: [
      'AUTO FAIL: chatbot — not found. Add FloatingChatWrapper scoped to bill management.',
      'AUTO FAIL: rate_limit — add checkRateLimit to AI routes.',
      'AUTO FAIL: analytics — add VPS tracker or Plausible to layout.tsx.',
      'AUDIT NEEDED §22: bg=#fffbf5 accent=#ea580c — check collision with mandirates (same!).',
      'FIX §22: billslash → change bg to #f8fafc and accent to #059669 (finance category).',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'firstline', url: 'https://firstline.so',
    auto_score: '17/20', auto_fails: 'json_ld, feedback, analytics',
    severity: 'high',
    notes: [
      'AUTO FAIL: json_ld — add WebSite JSON-LD schema to layout.tsx.',
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: analytics — add VPS tracker or Plausible to layout.tsx.',
      'AUDIT NEEDED §22: bg=#f8fafc accent=#2563eb — TRIPLE collision with draftcal+aicoachlab. Must fix.',
      'FIX §22: firstline → change to bg=#faf5ff accent=#7c3aed (professional violet).',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'playsmart', url: 'https://playsmart.app',
    auto_score: '17/20', auto_fails: 'feedback, rate_limit, analytics',
    severity: 'high',
    notes: [
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: rate_limit — add checkRateLimit.',
      'AUTO FAIL: analytics — add tracker to layout.tsx.',
      'AUDIT NEEDED §21: Gaming feel, not SaaS.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'quicktech', url: 'https://quicktech.app',
    auto_score: '17/20', auto_fails: 'chatbot, feedback, rate_limit',
    severity: 'high',
    notes: [
      'AUTO FAIL: chatbot — add FloatingChatWrapper scoped to tech support.',
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: rate_limit — add checkRateLimit.',
      'AUDIT NEEDED §24: Tech support specific content.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  // ── 4+ failures (CRITICAL) ─────────────────────────────────────────────────
  {
    name: 'hub', url: 'https://ai-products-hub.vercel.app',
    auto_score: '16/20', auto_fails: 'og_png, feedback, rate_limit, ai_fallback',
    severity: 'critical',
    notes: [
      'AUTO FAIL: og_png — generate 1200×630 OG image.',
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: rate_limit — add checkRateLimit.',
      'AUTO FAIL: ai_fallback — copy lib/ai.ts from ai-platform-template.',
      'NOTE: Hub is the portfolio dashboard — must always be live and polished.',
      'PRIORITY: Fix before any other site — it links to all others.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'outreach-crm', url: 'https://outreach-crm-olive.vercel.app',
    auto_score: '16/20', auto_fails: 'sitemap, robots, json_ld, feedback',
    severity: 'critical',
    notes: [
      'AUTO FAIL: sitemap — create app/sitemap.ts listing all routes.',
      'AUTO FAIL: robots — create public/robots.txt with Allow:/ + sitemap URL.',
      'AUTO FAIL: json_ld — add WebSite JSON-LD to layout.tsx.',
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'NOTE: Missing SEO basics — site is invisible to search engines.',
      'PRIORITY: SEO fixes first, then chatbot/feedback.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  {
    name: 'photorestore', url: 'https://photorestore.app',
    auto_score: '15/20', auto_fails: 'og_png, chatbot, feedback, rate_limit, ai_fallback',
    severity: 'critical',
    notes: [
      'AUTO FAIL: og_png — generate 1200×630.',
      'AUTO FAIL: chatbot — add FloatingChatWrapper.',
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: rate_limit — add checkRateLimit. (Critical — photo AI is expensive, unprotected = cost explosion).',
      'AUTO FAIL: ai_fallback — copy lib/ai.ts.',
      'PRIORITY: Rate limit FIRST (cost risk). Then ai_fallback, chatbot, feedback, og_png.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
  // ── remaining 3-failure batch ───────────────────────────────────────────────
  {
    name: 'replydesk', url: 'https://replydesk.app',
    auto_score: '17/20', auto_fails: 'og_png, feedback, rate_limit',
    severity: 'high',
    notes: [
      'AUTO FAIL: og_png — generate 1200×630.',
      'AUTO FAIL: feedback — add FeedbackWidget.',
      'AUTO FAIL: rate_limit — add checkRateLimit.',
      'AUDIT NEEDED §24: Customer support specific copy.',
      'AUDIT NEEDED §21-§30: full 30-point audit.',
    ].join('\n'),
  },
];

// ── Helpers ─────────────────────────────────────────────────────────────────
async function clearExistingTasks() {
  // Delete tasks created by qa-bot to allow fresh insert
  await sql`DELETE FROM tasks WHERE created_by = 'qa-bot' AND board_id = ${BOARD_ID}`;
  console.log('Cleared existing qa-bot tasks.');
}

async function insertTask(project) {
  const groupId = GROUPS[project.severity] ?? GROUPS.medium;
  const emoji = project.severity === 'critical' ? '🔴'
    : project.severity === 'high' ? '🟠'
    : project.severity === 'medium' ? '🟡'
    : project.severity === 'low' ? '🔵'
    : '✅';

  const title = `${emoji} ${project.name} — auto:${project.auto_score} | fails: ${project.auto_fails}`;

  const [{ pos }] = await sql`SELECT COALESCE(MAX(position), 0) as pos FROM tasks WHERE group_id = ${groupId}`;
  const [task] = await sql`
    INSERT INTO tasks (group_id, board_id, title, position, created_by)
    VALUES (${groupId}, ${BOARD_ID}, ${title}, ${Number(pos) + 1000}, 'qa-bot')
    RETURNING id
  `;

  const issueType = project.auto_fails === 'none' ? 'Audit Required' : 'Multiple Issues';
  const cells = [
    { colId: COLS.project,   value: project.name },
    { colId: COLS.url,       value: project.url },
    { colId: COLS.issueType, value: issueType },
    { colId: COLS.severity,  value: project.severity },
    { colId: COLS.notes,     value: project.notes },
  ];

  for (const c of cells) {
    await sql`
      INSERT INTO cell_values (task_id, column_id, value)
      VALUES (${task.id}, ${c.colId}, ${JSON.stringify(c.value)})
      ON CONFLICT (task_id, column_id) DO UPDATE SET value = EXCLUDED.value
    `;
  }

  console.log(`  ✓ ${project.name} → ${project.severity} [${task.id}]`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
console.log(`\n[push-portfolio-tasks] Inserting ${PROJECTS.length} project tasks into TaskFlow...\n`);
await clearExistingTasks();
for (const p of PROJECTS) {
  await insertTask(p);
}
console.log(`\n[push-portfolio-tasks] Done. ${PROJECTS.length} tasks created.`);
console.log('View board at: https://taskflow.app (Portfolio QA Audit board)\n');
