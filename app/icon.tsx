import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #4338ca, #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="4" width="6" height="6" rx="1.3" stroke="white" strokeWidth="1.8"/>
        <path d="M4.5 7l1 1 2-2" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 7h9M12 12h9M12 17h9" stroke="white" strokeWidth="2" strokeLinecap="round"/>
        <rect x="3" y="14" width="6" height="6" rx="1.3" stroke="white" strokeWidth="1.8" fill="white" fillOpacity="0.2"/>
      </svg>
    </div>
  )
}
