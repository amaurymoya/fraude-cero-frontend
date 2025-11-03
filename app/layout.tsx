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
