import { locales, type Locale } from "../i18n";

type LanguageSelectorProps = {
  locale: Locale;
  onLocaleChange: (locale: Locale) => void;
};

export function LanguageSelector({ locale, onLocaleChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] p-1">
      {locales.map((item) => (
        <button
          key={item.code}
          type="button"
          onClick={() => onLocaleChange(item.code)}
          aria-label={item.label}
          title={item.label}
          className={`grid min-h-10 min-w-10 place-items-center rounded-md text-xl transition ${
            locale === item.code
              ? "bg-gold/20 ring-1 ring-gold/50"
              : "hover:bg-white/[0.08]"
          }`}
        >
          <span aria-hidden="true">{item.flag}</span>
        </button>
      ))}
    </div>
  );
}
