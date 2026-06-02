import type { Locale } from "../i18n";
import { uiText } from "../i18n";

type EmptyStateProps = {
  locale: Locale;
};

export function EmptyState({ locale }: EmptyStateProps) {
  const text = uiText[locale];

  return (
    <section className="relative flex min-h-[360px] flex-1 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-panel/85 p-8 shadow-warm">
      <div className="relative max-w-sm text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-gold/80">{text.detailIntro}</p>
        <h2 className="mt-4 text-2xl font-semibold text-rice">{text.emptyTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-rice/62">{text.emptyBody}</p>
      </div>
    </section>
  );
}
