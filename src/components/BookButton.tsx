import { BookOpen } from "lucide-react";
import type { Locale } from "../i18n";

type BookButtonProps = {
  disabled: boolean;
  locale: Locale;
  onClick: () => void;
};

const labels: Record<Locale, { open: string; unavailable: string }> = {
  fr: { open: "Lire le chapitre du livre", unavailable: "Aucun chapitre trouvé" },
  en: { open: "Read the book chapter", unavailable: "No chapter found" },
  zh: { open: "阅读书中章节", unavailable: "未找到章节" },
};

export function BookButton({ disabled, locale, onClick }: BookButtonProps) {
  const text = labels[locale];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={disabled ? text.unavailable : text.open}
      title={disabled ? text.unavailable : text.open}
      className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 text-gold transition active:scale-95 hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-35"
    >
      <BookOpen className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
