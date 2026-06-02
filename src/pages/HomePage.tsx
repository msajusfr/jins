import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { JinDetail } from "../components/JinDetail";
import { JinList } from "../components/JinList";
import { LanguageSelector } from "../components/LanguageSelector";
import { SearchPanel } from "../components/SearchPanel";
import { VoiceSelector } from "../components/VoiceSelector";
import { jins } from "../data/jins";
import { useJinSearch } from "../hooks/useJinSearch";
import { useSpeechVoices } from "../hooks/useSpeechVoices";
import type { Locale } from "../i18n";
import { uiText } from "../i18n";
import { playOrCreateAudio } from "../services/audioService";
import type { JinEntry } from "../types";

export function HomePage() {
  const [query, setQuery] = useState("");
  const [locale, setLocale] = useState<Locale>("fr");
  const [selectedVoiceURI, setSelectedVoiceURI] = useState<string | undefined>();
  const [selectedJin, setSelectedJin] = useState<JinEntry | undefined>();
  const filteredJins = useJinSearch(jins, query);
  const speechVoices = useSpeechVoices();
  const familyCount = useMemo(() => new Set(jins.map((jin) => jin.family)).size, []);
  const text = uiText[locale];

  useEffect(() => {
    if (selectedJin && !filteredJins.some((jin) => jin.id === selectedJin.id)) {
      setSelectedJin(undefined);
    }
  }, [filteredJins, selectedJin]);

  async function handleSelectJin(jin: JinEntry) {
    setSelectedJin(jin);
    try {
      await playOrCreateAudio(jin, selectedVoiceURI);
    } catch {
      // Audio support varies by browser; selection should still work.
    }
  }

  return (
    <main className="min-h-screen px-4 py-5 text-rice sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-7xl flex-col">
        <header className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-gold/75">{text.martialGlossary}</p>
            <h1 className="mt-2 text-4xl font-bold tracking-tight text-rice md:text-5xl">Jin's</h1>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <LanguageSelector locale={locale} onLocaleChange={setLocale} />
            <VoiceSelector
              voices={speechVoices}
              selectedVoiceURI={selectedVoiceURI}
              locale={locale}
              onVoiceChange={setSelectedVoiceURI}
            />
            <p className="max-w-xl text-sm leading-6 text-rice/62 md:text-right">
              {text.subtitle(jins.length, familyCount)}
            </p>
          </div>
        </header>

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="flex max-h-[46vh] min-h-[340px] flex-col rounded-xl border border-white/10 bg-panel/90 p-4 shadow-warm lg:max-h-none">
            <SearchPanel query={query} locale={locale} onQueryChange={setQuery} />
            <div className="my-4 h-px bg-white/10" />
            <div className="mb-3 flex items-center justify-between text-xs text-rice/50">
              <span>{text.countLabel(filteredJins.length)}</span>
              <span>{text.instantSearch}</span>
            </div>
            <JinList
              jins={filteredJins}
              locale={locale}
              selectedJin={selectedJin}
              onSelect={handleSelectJin}
            />
          </aside>

          {selectedJin ? (
            <JinDetail jin={selectedJin} locale={locale} voiceURI={selectedVoiceURI} />
          ) : (
            <EmptyState locale={locale} />
          )}
        </div>
      </div>
    </main>
  );
}
