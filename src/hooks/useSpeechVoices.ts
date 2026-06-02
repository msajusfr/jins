import { useEffect, useState } from "react";
import { getAvailableSpeechVoices } from "../services/audioService";

export function useSpeechVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    let cancelled = false;

    async function loadVoices() {
      if (!("speechSynthesis" in window)) {
        return;
      }

      const availableVoices = await getAvailableSpeechVoices();
      if (!cancelled) {
        setVoices(availableVoices);
      }
    }

    void loadVoices();
    window.speechSynthesis?.addEventListener("voiceschanged", loadVoices);

    return () => {
      cancelled = true;
      window.speechSynthesis?.removeEventListener("voiceschanged", loadVoices);
    };
  }, []);

  return voices;
}
