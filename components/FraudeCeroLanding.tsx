'use client'
import React,{useMemo,useRef,useState} from 'react'
const FIGMA_URL='https://www.figma.com/make/BFdP8dbOzbDeNRYQlqBTm9/Mockup-App-Fraude-Cero?node-id=0-1&p=f&fullscreen=1'
const API_DOCS_URL='https://fraudecero.onrender.com/docs#/default/analizar_mensaje_api_analizar_post'
export default function FraudeCeroLanding(){
  const demoRef=useRef<HTMLDivElement|null>(null)
  const [msg,setMsg]=useState(''); const [loading,setLoading]=useState(false)
  const [error,setError]=useState<string|null>(null); const [result,setResult]=useState<any>(null)
  const examples=useMemo(()=>[
    'Hola, soy del banco. Necesito que me compartas tu clave por seguridad.',
    'Te ganaste un premio. Ingresa al siguiente enlace y pon tu RUT y tarjeta.',
    'Tu cuenta será bloqueada hoy. Paga esta “tarifa de verificación” ahora.',
  ],[])
  const handleAnalyze=async()=>{ setError(null); setResult(null);
    if(!msg.trim()){ setError('Escribe un mensaje a analizar.'); return; }
    try{
      setLoading(true)
      const res=await fetch('/api/analizar',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({mensaje:msg}) })
      if(!res.ok){ const t=await res.text(); throw new Error(`Error ${res.status}: ${t}`) }
      setResult(await res.json())
    }catch(e:any){ setError(e?.message||'Error de red.') } finally { setLoading(false) }
  }
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-neutral-200">
        <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="font-bold text-lg">Fraude Cero</div>
          <div className="flex items-center gap-2">
            <a className="px-3 py-2 rounded-xl text-sm font-medium bg-neutral-900 text-white" href={FIGMA_URL} target="_blank">Ver Figma</a>
            <a className="px-3 py-2 rounded-xl text-sm font-medium border border-neutral-300" href={API_DOCS_URL} target="_blank">API Docs</a>
            <button onClick={()=>demoRef.current?.scrollIntoView({behavior:'smooth'})} className="px-3 py-2 rounded-xl text-sm font-medium border border-neutral-900">Probar Demo</button>
          </div>
        </nav>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-3xl font-extrabold">Copiloto de seguridad para prevenir estafas</h1>
        <p className="mt-2 text-neutral-700">Analiza mensajes, entrega un score de riesgo y sugiere acciones simples.</p>
      </section>
      <section ref={demoRef} className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-2xl font-extrabold">Playground del API</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <label className="block text-sm font-semibold">Mensaje a analizar</label>
            <textarea value={msg} onChange={e=>setMsg(e.target.value)}
              className="mt-2 w-full h-44 rounded-xl border border-neutral-300 px-3 py-2 focus:ring-2 focus:ring-neutral-900"
              placeholder="Pega aquí el texto sospechoso…" />
            <div className="mt-3 flex flex-wrap gap-2">
              {examples.map((ex,i)=>(
                <button key={i} onClick={()=>setMsg(ex)} className="px-3 py-2 rounded-xl text-xs border border-neutral-300">Ejemplo {i+1}</button>
              ))}
              <button onClick={handleAnalyze} disabled={loading}
                className="ml-auto px-4 py-2 rounded-xl bg-neutral-900 text-white text-sm font-semibold">
                {loading?'Analizando…':'Analizar'}
              </button>
            </div>
            {error && <div className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-red-800 text-sm">{error}</div>}
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-white p-5">
            <div className="text-sm font-semibold mb-2">Respuesta</div>
            <pre className="h-64 overflow-auto rounded-xl bg-neutral-50 p-3 text-xs">
{result ? JSON.stringify(result,null,2) : `{
  "score": 0.92,
  "riesgo": "alto",
  "motivos": ["Solicita clave", "Urgencia inusual"],
  "sugerencias": ["No respondas", "Contacta a tu banco por canal oficial"]
}`}
            </pre>
          </div>
        </div>
      </section>
    </div>
  )
}
