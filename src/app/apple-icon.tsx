import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(150deg, #8f1538 0%, #6b0f28 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#faf6ef',
          fontSize: 128,
          fontWeight: 700,
          fontFamily: 'serif',
          letterSpacing: '-0.04em',
          paddingBottom: 8
        }}
      >
        N
      </div>
    ),
    size
  )
}
