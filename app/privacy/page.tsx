export const metadata = { title: 'Privacy Policy — TaskFlow', description: 'How TaskFlow handles your data.' }

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section style={{ marginBottom: 32 }}>
    <h2 style={{ fontSize: 20, fontWeight: 700, color: '#1e40af', marginBottom: 12 }}>{title}</h2>
    <div style={{ color: '#374151', lineHeight: 1.7, fontSize: 15 }}>{children}</div>
  </section>
)

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '60px 24px 80px' }}>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Privacy Policy</h1>
      <p style={{ color: '#64748b', marginBottom: 48, fontSize: 14 }}>Last updated: June 2025</p>
      <Section title="Data We Collect"><p>We collect task lists, descriptions, and priorities you enter for AI organization. We do not store these beyond your active session.</p></Section>
      <Section title="How We Use Data"><p>Task data is sent to AI to generate prioritization and scheduling suggestions. We never use your tasks for advertising or training.</p></Section>
      <Section title="Cookies"><p>We use minimal session cookies for functionality. No advertising or tracking cookies are used.</p></Section>
      <Section title="Third-Party Services"><p>AI processing uses Groq and/or OpenAI APIs. Task data is subject to their privacy policies during processing.</p></Section>
      <Section title="Data Retention"><p>Task data is not retained after your session. No task content is stored server-side.</p></Section>
      <Section title="Your Rights"><p>Email privacy@taskflow.app to request deletion of any data we hold about you.</p></Section>
      <Section title="Children&apos;s Privacy"><p>This service is not directed at children under 13. We do not knowingly collect data from minors.</p></Section>
      <Section title="Contact"><p>Questions? Email <a href="mailto:privacy@taskflow.app" style={{ color: '#2563eb' }}>privacy@taskflow.app</a></p></Section>
    </main>
  )
}
