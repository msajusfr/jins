import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { JinDetail } from "../components/JinDetail";
import { JinList } from "../components/JinList";
import { SearchPanel } from "../components/SearchPanel";
import { jins } from "../data/jins";
import { useJinSearch } from "../hooks/useJinSearch";
import { playOrCreateAudio } from "../services/audioService";
import type { JinEntry } from "../types";

export function HomePage() {
  const [query, setQuery] = useState("");
  const [selectedJin, setSelectedJin] = useState<JinEntry | undefined>();
  const filteredJins = useJinSearch(jins, query);
  const familyCount = useMemo(() => new Set(jins.map((jin) => jin.family)).size, []);

  useEffect(() => {
    if (selectedJin && !filteredJins.some((jin) => jin.id === selectedJin.id)) {
      setSelectedJin(undefined);
    }
  }, [filteredJins, selectedJin]);

  async function handleSelectJin(jin: JinEntry) {
    setSelectedJin(jin);
    try {
      await playOrCreateAudio(jin);
    } catch {
      // Audio support varies by browser; selection should still work.
    }
  }

  return (
    <main className="min-h-screen px-4 py-5 text-rice sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-7xl flex-col">
        <header className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-gold/75">Glossaire martial</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-rice md:text-5xl">Jin's</h1>
          </div>
          <p className="max-w-xl text-sm leading-6 text-rice/62">
            {jins.length} qualités de force, {familyCount} familles, une interface légère à partager sur mobile ou desktop.
          </p>
        </header>

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="flex max-h-[46vh] min-h-[340px] flex-col rounded-xl border border-white/10 bg-panel/90 p-4 shadow-warm lg:max-h-none">
            <SearchPanel query={query} onQueryChange={setQuery} />
            <div className="my-4 h-px bg-white/10" />
            <div className="mb-3 flex items-center justify-between text-xs text-rice/50">
              <span>{filteredJins.length} Jìn</span>
              <span>Recherche instantanée</span>
            </div>
            <JinList jins={filteredJins} selectedJin={selectedJin} onSelect={handleSelectJin} />
          </aside>

          {selectedJin ? <JinDetail jin={selectedJin} /> : <EmptyState />}
        </div>
      </div>
    </main>
  );
}
