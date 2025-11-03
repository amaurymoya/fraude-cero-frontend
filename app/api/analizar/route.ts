export const runtime = 'nodejs'

function safeJson(text: string) {
  try { return JSON.parse(text) } catch { return { raw: text } }
}

export async function GET() {
  // Salud del proxy: permite verificar la URL configurada en Render
  return Response.json({
    ok: true,
    endpoint: process.env.API_ENDPOINT ?? null
  })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    if (!body?.mensaje || typeof body.mensaje !== 'string') {
      return Response.json({ error: 'Falta campo "mensaje" (string).' }, { status: 400 })
    }

    const endpoint = process.env.API_ENDPOINT || 'https://fraudecero.onrender.com/api/analizar'
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: body.mensaje }),
    })

    const text = await upstream.text()
    const payload = safeJson(text) // ← siempre JSON (si no, lo envuelve en { raw: … })

    return Response.json(payload, { status: upstream.status })
  } catch (e: any) {
    return Response.json({ error: e?.message || 'Error interno' }, { status: 500 })
  }
}
