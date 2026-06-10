import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Nativly' }

export default function Page() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-muted-foreground text-sm">Bu bölmə hazırlanır... (Gün 5+)</p>
    </div>
  )
}
