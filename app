import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Fraude Cero – Copiloto de seguridad',
  description: 'Prevención de estafas digitales con claridad y accesibilidad.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="antialiased bg-neutral-50 text-neutral-900">{children}</body>
    </html>
  )
}

@tailwind base;
@tailwind components;
@tailwind utilities;
import FraudeCeroLanding from '@/components/FraudeCeroLanding'
export default function Page() { return <FraudeCeroLanding /> }
export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body?.mensaje || typeof body.mensaje !== 'string') {
      return new Response(JSON.stringify({ error: 'Falta campo "mensaje" (string).' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      })
    }
    const endpoint = process.env.API_ENDPOINT || 'https://fraudecero.onrender.com/api/analizar'
    const upstream = await fetch(endpoint, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: body.mensaje }),
    })
    const text = await upstream.text()
    let payload: any = text; try { payload = JSON.parse(text) } catch {}
    return new Response(typeof payload === 'string' ? payload : JSON.stringify(payload), {
      status: upstream.status, headers: { 'Content-Type': 'application/json' },
    })
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || 'Error interno' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }
}
