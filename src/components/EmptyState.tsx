export function EmptyState() {
  return (
    <section className="relative flex min-h-[360px] flex-1 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-panel/85 p-8 shadow-warm">
      <div className="absolute -right-10 -top-16 select-none text-[11rem] leading-none text-white/[0.025]">
        ☯
      </div>
      <div className="relative max-w-sm text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-gold/80">Détail sur la force</p>
        <h2 className="mt-4 text-2xl font-semibold text-rice">Sélectionne une force</h2>
        <p className="mt-3 text-sm leading-6 text-rice/62">
          Choisis un Jìn dans la liste pour afficher son détail, ses exercices et son application.
        </p>
      </div>
    </section>
  );
}
