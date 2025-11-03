'use client'
import React,{useMemo,useRef,useState} from 'react'
import {motion} from 'framer-motion'
const FIGMA_URL='https://www.figma.com/make/BFdP8dbOzbDeNRYQlqBTm9/Mockup-App-Fraude-Cero?node-id=0-1&p=f&t=XpuGLYDzI2Q7hiFk-0&fullscreen=1'
const API_DOCS_URL='https://fraudecero.onrender.com/docs#/default/analizar_mensaje_api_analizar_post'
export default function FraudeCeroLanding(){
 const demoRef=useRef<HTMLDivElement|null>(null)
 const [msg,setMsg]=useState(''); const [loading,setLoading]=useState(false); const [error,setError]=useState<string|null>(null); const [result,setResult]=useState<any>(null)
 const examples=useMemo(()=>['Hola, soy del banco. Necesito que me compartas tu clave por seguridad.','Te ganaste un premio. Ingresa al siguiente enlace y pon tu RUT y tarjeta.','Tu cuenta será bloqueada hoy. Paga esta “tarifa de verificación” ahora.'],[])
 const handleAnalyze=async()=>{ setError(null); setResult(null); if(!msg.trim()){setError('Escribe un mensaje a analizar.'); return;}
  try{ setLoading(true); const res=await fetch('/api/analizar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({mensaje:msg})}); if(!res.ok){const t=await res.text(); throw new Error(`Error ${res.status}: ${t}`)}; const data=await res.json(); setResult(data);}catch(e:any){setError(e?.message||'Error de red.')}finally{setLoading(false)}}
 const pretty=(x:any)=>{try{return JSON.stringify(x,null,2)}catch{return String(x)}}
 const scrollToDemo=()=>demoRef.current?.scrollIntoView({behavior:'smooth'})
 return(<div className='min-h-screen bg-neutral-50 text-neutral-900'>
  <header className='sticky top-0 z-50 backdrop-blur bg-white/70 border-b border-neutral-200'>
   <nav className='mx-auto max-w-6xl px-4 py-3 flex items-center justify-between'>
    <div className='flex items-center gap-3'><div className='h-8 w-8 rounded-2xl bg-neutral-900'/><span className='font-bold text-lg tracking-tight'>Fraude Cero</span></div>
    <div className='flex items-center gap-2'>
      <a href={FIGMA_URL} target='_blank' rel='noreferrer' className='px-3 py-2 rounded-xl text-sm font-medium bg-neutral-900 text-white hover:opacity-90'>Ver Figma</a>
      <a href={API_DOCS_URL} target='_blank' rel='noreferrer' className='px-3 py-2 rounded-xl text-sm font-medium border border-neutral-300 hover:bg-neutral-100'>API Docs</a>
      <button onClick={scrollToDemo} className='px-3 py-2 rounded-xl text-sm font-medium border border-neutral-900'>Probar Demo</button>
    </div>
   </nav>
  </header>
  <section className='mx-auto max-w-6xl px-4 py-16 grid gap-8 md:grid-cols-2 items-center'>
   <div>
    <motion.h1 initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className='text-4xl md:text-5xl font-extrabold tracking-tight'>Copiloto de seguridad para prevenir estafas digitales</motion.h1>
    <p className='mt-4 text-lg leading-relaxed text-neutral-700'>Diseñado para adultos mayores y cuidadores. Analiza mensajes y enlaces con un lenguaje claro, muestra un <span className='font-semibold'>score de riesgo</span> y sugiere acciones rápidas.</p>
    <div className='mt-6 flex flex-wrap items-center gap-3'>
      <button onClick={scrollToDemo} className='px-5 py-3 rounded-2xl bg-neutral-900 text-white text-sm font-semibold hover:opacity-90'>Probar ahora</button>
      <a className='px-5 py-3 rounded-2xl border border-neutral-300 text-sm font-semibold hover:bg-neutral-100' href={API_DOCS_URL} target='_blank' rel='noreferrer'>Ver API en vivo</a>
    </div>
   </div>
   <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6,delay:0.1}} className='rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm'>
    <div className='aspect-[4/3] w-full rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-500'>Vista previa del prototipo (Figma)</div>
    <div className='mt-3 flex items-center justify-between'><span className='text-sm text-neutral-600'>App Fraude Cero</span><a className='text-sm font-semibold underline' href={FIGMA_URL} target='_blank' rel='noreferrer'>Abrir Figma</a></div>
   </motion.div>
  </section>
  <section ref={demoRef} className='mx-auto max-w-6xl px-4 py-12'>
   <h2 className='text-2xl font-extrabold'>Playground del API</h2>
   <p className='mt-2 text-neutral-700 max-w-3xl'>Prueba el endpoint <code className='px-1 rounded bg-neutral-100'>POST /api/analizar</code>. Usa ejemplos ficticios.</p>
   <div className='mt-6 grid gap-4 md:grid-cols-2'>
    <div className='rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm'>
     <label htmlFor='msg' className='block text-sm font-semibold'>Mensaje a analizar</label>
     <textarea id='msg' value={msg} onChange={(e)=>setMsg(e.target.value)} className='mt-2 w-full h-44 resize-y rounded-2xl border border-neutral-300 px-3 py-2 focus:ring-2 focus:ring-neutral-900' placeholder='Pega aquí el texto sospechoso…'/>
     <div className='mt-3 flex flex-wrap gap-2'>
      {examples.map((ex,i)=>(<button key={i} onClick={()=>setMsg(ex)} className='px-3 py-2 rounded-xl text-xs border border-neutral-300 hover:bg-neutral-100'>Ejemplo {i+1}</button>))}
      <button onClick={handleAnalyze} className='ml-auto px-4 py-2 rounded-xl bg-neutral-900 text-white text-sm font-semibold hover:opacity-90' disabled={loading}>{loading?'Analizando…':'Analizar'}</button>
     </div>
     {error && <div className='mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-red-800 text-sm'>{error}</div>}
    </div>
    <div className='rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm overflow-hidden'>
     <div className='flex items-center justify-between'><div className='text-sm font-semibold'>Respuesta</div><div className='text-xs text-neutral-500'>/api/analizar → backend</div></div>
     <pre className='mt-2 h-64 overflow-auto rounded-2xl bg-neutral-50 p-3 text-xs'>{result?pretty(result):`{
  "score": 0.92,
  "riesgo": "alto",
  "motivos": ["Solicita clave", "Urgencia inusual"],
  "sugerencias": ["No respondas", "Contacta a tu banco por canal oficial"]
}`}</pre>
    </div>
   </div>
  </section>
  <footer className='border-t border-neutral-200 bg-white'>
   <div className='mx-auto max-w-6xl px-4 py-6 text-sm text-neutral-600 flex flex-col md:flex-row gap-3 md:items-center md:justify-between'>
    <div>© {new Date().getFullYear()} Fraude Cero</div>
    <div className='flex gap-4'>
      <a className='underline' href={API_DOCS_URL} target='_blank' rel='noreferrer'>API Docs</a>
      <a className='underline' href={FIGMA_URL} target='_blank' rel='noreferrer'>Prototipo Figma</a>
    </div>
   </div>
  </footer>
 </div>)}
