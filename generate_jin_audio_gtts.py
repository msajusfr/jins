#!/usr/bin/env python3
"""Generation audio MP3 pour les noms des Jin."""

from __future__ import annotations

import os
import subprocess
import sys
from pathlib import Path

from gtts import gTTS

from jin_data import JIN_ENTRIES, JinEntry, slugify

AUDIO_DIR = Path("audio")


def get_audio_filename(jin: JinEntry) -> str:
    return f"{slugify(jin.display_name)}.mp3"


def get_audio_path(jin: JinEntry, output_dir: Path | str = AUDIO_DIR) -> Path:
    return Path(output_dir) / get_audio_filename(jin)


def create_audio(jin: JinEntry, output_dir: Path | str = AUDIO_DIR) -> Path:
    output_path = get_audio_path(jin, output_dir)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    gTTS(text=jin.audio_text, lang="fr", slow=False).save(str(output_path))
    return output_path


def play_audio_file(audio_path: Path) -> None:
    if sys.platform.startswith("win"):
        os.startfile(audio_path)  # type: ignore[attr-defined]
    elif sys.platform == "darwin":
        subprocess.Popen(["open", str(audio_path)])
    else:
        subprocess.Popen(["xdg-open", str(audio_path)])


def play_or_create_audio(jin: JinEntry, output_dir: Path | str = AUDIO_DIR) -> Path:
    audio_path = get_audio_path(jin, output_dir)
    if not audio_path.exists():
        audio_path = create_audio(jin, output_dir)
    play_audio_file(audio_path)
    return audio_path


def main() -> None:
    for index, jin in enumerate(JIN_ENTRIES, 1):
        print(f"{index:02d}. {jin.chinese}  {jin.display_name}  ({jin.pinyin})")

    choice = input(f"Choisis un numero (1-{len(JIN_ENTRIES)}) : ").strip()
    if not choice.isdigit() or not 1 <= int(choice) <= len(JIN_ENTRIES):
        raise SystemExit("Numero invalide.")

    jin = JIN_ENTRIES[int(choice) - 1]
    path = create_audio(jin)
    print(f"Cree : {path}")


if __name__ == "__main__":
    main()
