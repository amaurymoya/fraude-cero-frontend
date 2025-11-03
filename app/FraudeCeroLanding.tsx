const handleAnalyze = async () => {
  setError(null); setResult(null);
  if (!msg.trim()) { setError('Escribe un mensaje a analizar.'); return; }

  try {
    setLoading(true);
    const res = await fetch('/api/analizar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensaje: msg }),
    });

    const text = await res.text();
    let data: any;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!res.ok) {
      setError(typeof data === 'object' ? JSON.stringify(data) : String(data));
      return;
    }

    setResult(data);
  } catch (e: any) {
    setError(e?.message || 'Error de red.');
  } finally {
    setLoading(false);
  }
};
