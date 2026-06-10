export default function AuthDivider({ label }: { label: string }) {
  return (
    <div className="relative flex items-center gap-3">
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
      <span className="text-[0.7rem] font-semibold uppercase tracking-wider text-foreground/40">{label}</span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
    </div>
  )
}
