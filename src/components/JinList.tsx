import type { JinEntry } from "../types";

type JinListProps = {
  jins: JinEntry[];
  selectedJin?: JinEntry;
  onSelect: (jin: JinEntry) => void;
};

export function JinList({ jins, selectedJin, onSelect }: JinListProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
      {jins.map((jin) => {
        const active = selectedJin?.id === jin.id;
        return (
          <button
            key={jin.id}
            type="button"
            onClick={() => onSelect(jin)}
            className={`w-full rounded-lg border p-3 text-left transition ${
              active
                ? "border-gold/60 bg-cinnabar/35 shadow-lg shadow-cinnabar/10"
                : "border-white/8 bg-white/[0.04] hover:border-gold/30 hover:bg-white/[0.07]"
            }`}
          >
            <span className="block text-lg font-semibold leading-none text-rice">{jin.chinese}</span>
            <span className="mt-2 block text-sm font-medium text-gold">{jin.displayName}</span>
            <span className="mt-1 block text-xs text-rice/55">{jin.family}</span>
          </button>
        );
      })}
    </div>
  );
}
