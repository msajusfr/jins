import { Search } from "lucide-react";
import type { Locale } from "../i18n";
import { uiText } from "../i18n";

type SearchPanelProps = {
  query: string;
  locale: Locale;
  onQueryChange: (query: string) => void;
};

export function SearchPanel({ query, locale, onQueryChange }: SearchPanelProps) {
  const text = uiText[locale];

  return (
    <label className="relative block">
      <span className="sr-only">{text.searchLabel}</span>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rice/45" />
      <input
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder={text.searchPlaceholder}
        className="min-h-12 w-full rounded-lg border border-white/10 bg-white/[0.06] pl-10 pr-3 text-sm text-rice outline-none transition placeholder:text-rice/40 focus:border-gold/50 focus:bg-white/[0.09]"
      />
    </label>
  );
}
