import { Volume2 } from "lucide-react";
import { useState } from "react";
import { playOrCreateAudio } from "../services/audioService";
import type { JinEntry } from "../types";

type AudioButtonProps = {
  jin: JinEntry;
};

export function AudioButton({ jin }: AudioButtonProps) {
  const [status, setStatus] = useState<"idle" | "playing" | "error">("idle");

  async function handleClick() {
    try {
      setStatus("playing");
      await playOrCreateAudio(jin);
      window.setTimeout(() => setStatus("idle"), 1100);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2200);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Écouter ${jin.displayName}`}
      className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg border border-gold/25 bg-gold/10 text-gold transition active:scale-95 hover:bg-gold/20"
      title={status === "error" ? "Audio indisponible" : "Écouter"}
    >
      <Volume2 className="h-5 w-5" aria-hidden="true" />
    </button>
  );
}
