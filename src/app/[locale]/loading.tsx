export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="h-16 md:h-[72px] border-b border-ink/8" />
      <div className="pt-12 md:pt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-3 w-24 bg-ink/8 rounded-full mb-8" />
          <div className="h-12 md:h-20 w-full max-w-3xl bg-ink/6 rounded-2xl mb-4 animate-pulse" />
          <div className="h-12 md:h-20 w-2/3 max-w-2xl bg-ink/6 rounded-2xl mb-12 animate-pulse" />
          <div className="h-4 w-full max-w-xl bg-ink/5 rounded-full mb-3" />
          <div className="h-4 w-5/6 max-w-xl bg-ink/5 rounded-full" />
        </div>
      </div>
    </div>
  )
}
