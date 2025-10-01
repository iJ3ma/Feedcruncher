const gradientLookup = {
  'bg-blue-500': 'from-blue-500/90 via-blue-500/70 to-blue-600/80',
  'bg-slate-800': 'from-slate-800/95 via-slate-900/80 to-black/60',
  'bg-indigo-600': 'from-indigo-500/90 via-indigo-500/70 to-indigo-700/80',
  'bg-sky-500': 'from-sky-500/90 via-sky-400/70 to-sky-600/80'
};

export default function FeedBubble({ feed }) {
  const gradient = gradientLookup[feed.theme] ?? 'from-slate-800/90 via-slate-900/70 to-slate-950/70';

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-800/70 bg-slate-900/75 backdrop-blur-xl transition hover:border-emerald-500/50 hover:shadow-[0_18px_65px_-30px_rgba(34,197,94,0.65)]">
      <header
        className={`drag-handle flex items-center justify-between gap-3 bg-gradient-to-r px-5 py-4 text-sm font-semibold uppercase tracking-[0.2em] text-white shadow-inner shadow-slate-900/40 transition group-hover:tracking-[0.25em] ${gradient}`}
      >
        <span>{feed.platform}</span>
        <span className="rounded-full border border-white/30 px-2 py-[2px] text-[11px] font-medium text-white/90">
          Drag ✥
        </span>
      </header>
      <div className="non-draggable flex flex-1 flex-col justify-between px-5 py-6 text-slate-200">
        <p className="text-lg font-medium leading-relaxed text-slate-100">
          {feed.text}
        </p>
        <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.35em] text-slate-500">
          <span>ID: {feed.id}</span>
          <span>Live</span>
        </div>
      </div>
    </article>
  );
}
