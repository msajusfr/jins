import type { JinEntry } from "../types";

function getVoicesWhenReady() {
  const voices = window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    return Promise.resolve(voices);
  }

  return new Promise<SpeechSynthesisVoice[]>((resolve) => {
    window.speechSynthesis.addEventListener(
      "voiceschanged",
      () => resolve(window.speechSynthesis.getVoices()),
      { once: true },
    );
    window.setTimeout(() => resolve(window.speechSynthesis.getVoices()), 500);
  });
}

export async function getAvailableSpeechVoices() {
  const voices = await getVoicesWhenReady();
  const chineseVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith("zh"));
  return chineseVoices.length > 0 ? chineseVoices : voices;
}

async function findPreferredVoice(voiceURI?: string) {
  const voices = await getVoicesWhenReady();
  if (voiceURI) {
    const selectedVoice = voices.find((voice) => voice.voiceURI === voiceURI);
    if (selectedVoice) {
      return selectedVoice;
    }
  }

  return (
    voices.find((voice) => voice.lang.toLowerCase() === "zh-cn") ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith("zh"))
  );
}

export async function playOrCreateAudio(jin: JinEntry, voiceURI?: string) {
  if (!("speechSynthesis" in window)) {
    throw new Error("La synthèse vocale n'est pas disponible dans ce navigateur.");
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(jin.audioText);
  utterance.rate = 0.82;
  utterance.pitch = 0.95;
  utterance.lang = "zh-CN";

  const voice = await findPreferredVoice(voiceURI);
  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);
}
