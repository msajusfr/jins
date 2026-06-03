import type { Locale } from "../i18n";
import { localizeShortFamily } from "../i18n";
import type { JinEntry } from "../types";

type JinListProps = {
  jins: JinEntry[];
  locale: Locale;
  selectedJin?: JinEntry;
  onSelect: (jin: JinEntry) => void;
};

export function JinList({ jins, locale, selectedJin, onSelect }: JinListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pr-1">
      {jins.map((jin) => {
        const active = selectedJin?.id === jin.id;
        return (
          <button
            key={jin.id}
            type="button"
            onClick={() => onSelect(jin)}
            className={`w-full rounded-lg border px-3 py-2 text-left transition ${
              active
                ? "border-gold/60 bg-cinnabar/35 shadow-lg shadow-cinnabar/10"
                : "border-white/8 bg-white/[0.04] hover:border-gold/30 hover:bg-white/[0.07]"
            }`}
          >
            <span className="flex min-w-0 items-baseline gap-2 whitespace-nowrap">
              <span className="shrink-0 text-lg font-semibold leading-none text-rice">{jin.chinese}</span>
              <span className="shrink-0 text-sm font-medium text-gold">{jin.pinyin}</span>
              <span className="min-w-0 truncate text-xs text-rice/55">
                {localizeShortFamily(jin.family, locale)}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
