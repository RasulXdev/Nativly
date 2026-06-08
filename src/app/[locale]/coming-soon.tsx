import Link from 'next/link'

interface ComingSoonProps {
  title: string
  locale: string
}

export default function ComingSoon({ title, locale }: ComingSoonProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <div className="text-6xl">🚧</div>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-muted-foreground">Bu səhifə hazırlanır...</p>
      <Link
        href={`/${locale}`}
        className="mt-4 text-primary hover:underline"
      >
        ← Ana səhifəyə qayıt
      </Link>
    </div>
  )
}
