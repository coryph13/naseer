import { ImageResponse } from 'next/og'

export const alt = 'Naseer — кондитерская фабрика в Ташкенте'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          background: '#faf6ef',
          padding: '80px 96px',
          position: 'relative',
          fontFamily: 'serif'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 520,
            height: 520,
            background:
              'radial-gradient(circle at 70% 30%, rgba(143,21,56,0.18), transparent 65%)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 480,
            height: 360,
            background:
              'radial-gradient(circle at 25% 80%, rgba(245,188,68,0.20), transparent 60%)'
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 1.5, background: '#8f1538' }} />
          <div
            style={{
              color: '#8f1538',
              fontSize: 18,
              fontFamily: 'sans-serif',
              fontWeight: 600,
              letterSpacing: 4,
              textTransform: 'uppercase'
            }}
          >
            Naseer · Confectionery factory
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto' }}>
          <div
            style={{
              fontSize: 240,
              fontWeight: 700,
              color: '#14110f',
              lineHeight: 0.88,
              letterSpacing: '-0.06em',
              fontFamily: 'serif'
            }}
          >
            Naseer
          </div>
          <div
            style={{
              marginTop: 32,
              fontSize: 30,
              color: 'rgba(20,17,15,0.65)',
              fontFamily: 'sans-serif',
              lineHeight: 1.3,
              maxWidth: 760
            }}
          >
            Кондитерская фабрика в Ташкенте. Пять линеек, шестьдесят позиций.
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            display: 'flex',
            height: 8
          }}
        >
          <div style={{ flex: 1, background: '#f5bc44' }} />
          <div style={{ flex: 1, background: '#906a54' }} />
          <div style={{ flex: 1, background: '#90cc8d' }} />
          <div style={{ flex: 1, background: '#b01e23' }} />
          <div style={{ flex: 1, background: '#dbafd0' }} />
        </div>
      </div>
    ),
    size
  )
}
