import { AudioLines } from "lucide-react";
import type { Locale } from "../i18n";

type VoiceSelectorProps = {
  voices: SpeechSynthesisVoice[];
  selectedVoiceURI?: string;
  locale: Locale;
  onVoiceChange: (voiceURI: string | undefined) => void;
};

const labels: Record<Locale, { label: string; automatic: string; unavailable: string }> = {
  fr: {
    label: "Voix",
    automatic: "Voix automatique",
    unavailable: "Aucune voix sélectionnable",
  },
  en: {
    label: "Voice",
    automatic: "Automatic voice",
    unavailable: "No selectable voice",
  },
  zh: {
    label: "声音",
    automatic: "自动声音",
    unavailable: "没有可选声音",
  },
};

export function VoiceSelector({
  voices,
  selectedVoiceURI,
  locale,
  onVoiceChange,
}: VoiceSelectorProps) {
  const text = labels[locale];

  return (
    <label className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-rice/70 md:w-auto">
      <AudioLines className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
      <span className="sr-only">{text.label}</span>
      <select
        value={selectedVoiceURI ?? ""}
        onChange={(event) => onVoiceChange(event.target.value || undefined)}
        disabled={voices.length === 0}
        className="min-h-8 w-full min-w-0 bg-transparent text-rice outline-none disabled:text-rice/35 md:w-64"
      >
        <option value="">{voices.length === 0 ? text.unavailable : text.automatic}</option>
        {voices.map((voice) => (
          <option key={voice.voiceURI} value={voice.voiceURI}>
            {voice.name} · {voice.lang}
          </option>
        ))}
      </select>
    </label>
  );
}
