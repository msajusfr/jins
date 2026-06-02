import type { JinEntry } from "../types";

function findPreferredVoice() {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((voice) => voice.lang.toLowerCase().startsWith("zh")) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ??
    voices[0]
  );
}

export async function playOrCreateAudio(jin: JinEntry) {
  if (!("speechSynthesis" in window)) {
    throw new Error("La synthèse vocale n'est pas disponible dans ce navigateur.");
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(jin.audioText);
  utterance.rate = 0.82;
  utterance.pitch = 0.95;
  utterance.lang = "zh-CN";

  const voice = findPreferredVoice();
  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);
}
