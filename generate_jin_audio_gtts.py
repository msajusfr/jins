#!/usr/bin/env python3
"""
Génère un fichier audio WAV/MP3 pour apprendre les "Jin" (劲) des arts martiaux chinois.
Voix chinoise naturelle via gTTS + voix française via gTTS.

Prérequis :
    pip install gTTS pydub
    ffmpeg installé sur la machine

Usage :
    python generate_jin_audio.py
"""

import os
import tempfile
from gtts import gTTS
from pydub import AudioSegment
from pydub.effects import normalize

PAUSE_SHORT = 800
PAUSE_MEDIUM = 1400
PAUSE_LONG = 2300
PAUSE_SECTION = 3500

SECTIONS = [
    {
        "intro_fr": "Section 1. Forces de spirale, rotation et enroulement.",
        "terms": [
            ("磨劲", "mó jìn", "force qui broie, ou écrase progressivement"),
            ("磨盘劲", "mópán jìn", "force de meule rotative"),
            ("缠劲", "chán jìn", "force qui enroule"),
            ("缠丝劲", "chánsī jìn", "force du fil de soie"),
            ("螺旋劲", "luóxuán jìn", "force hélicoïdale"),
            ("钻劲", "zuān jìn", "force qui fore ou perce"),
            ("裹劲", "guǒ jìn", "force qui enveloppe"),
            ("绕劲", "rào jìn", "force circulaire qui contourne"),
            ("旋劲", "xuán jìn", "force rotative"),
        ],
    },
    {
        "intro_fr": "Section 2. Forces collantes et de contrôle.",
        "terms": [
            ("沾劲", "zhān jìn", "force adhérente"),
            ("黏劲", "nián jìn", "force collante"),
            ("沾黏劲", "zhānnián jìn", "force collante et adhérente"),
            ("听劲", "tīng jìn", "force d'écoute, capacité à sentir l'intention adverse"),
            ("化劲", "huà jìn", "force de neutralisation ou de transformation"),
            ("引劲", "yǐn jìn", "force qui guide ou attire"),
            ("拿劲", "ná jìn", "force de saisie et de contrôle"),
            ("粘连劲", "zhānlián jìn", "connexion collante continue"),
        ],
    },
    {
        "intro_fr": "Section 3. Forces explosives et pénétrantes.",
        "terms": [
            ("发劲", "fā jìn", "émission de force"),
            ("爆劲", "bào jìn", "force explosive"),
            ("寸劲", "cùn jìn", "force à très courte distance"),
            ("透劲", "tòu jìn", "force pénétrante"),
            ("冲劲", "chōng jìn", "force de charge"),
            ("崩劲", "bēng jìn", "force qui éclate ou brise"),
            ("弹劲", "tán jìn", "force élastique"),
            ("抖劲", "dǒu jìn", "force vibratoire ou secouante"),
            ("炸劲", "zhà jìn", "force explosive brutale"),
        ],
    },
    {
        "intro_fr": "Section 4. Forces lourdes et descendantes.",
        "terms": [
            ("沉劲", "chén jìn", "force lourde descendante"),
            ("坠劲", "zhuì jìn", "force qui fait tomber"),
            ("压劲", "yā jìn", "force de pression"),
            ("吞劲", "tūn jìn", "force qui absorbe"),
            ("吞吐劲", "tūntǔ jìn", "absorber puis rejeter"),
            ("整劲", "zhěng jìn", "force unifiée du corps entier"),
        ],
    },
    {
        "intro_fr": "Section 5. Forces longues et extensives.",
        "terms": [
            ("长劲", "cháng jìn", "force longue"),
            ("放劲", "fàng jìn", "force qui relâche ou projette"),
            ("伸劲", "shēn jìn", "force d'extension"),
            ("通劲", "tōng jìn", "force qui traverse"),
            ("贯劲", "guàn jìn", "force qui pénètre tout le corps"),
        ],
    },
    {
        "intro_fr": "Section 6. Les huit forces principales du Taiji Quan.",
        "terms": [
            ("掤劲", "péng jìn", "force expansive, souvent appelée ward off"),
            ("捋劲", "lǚ jìn", "force qui détourne et tire"),
            ("挤劲", "jǐ jìn", "compression vers l'avant"),
            ("按劲", "àn jìn", "pression descendante"),
            ("采劲", "cǎi jìn", "force d'arracher ou de cueillir"),
            ("挒劲", "liè jìn", "force qui sépare ou fend"),
            ("肘劲", "zhǒu jìn", "force du coude"),
            ("靠劲", "kào jìn", "force d'épaule ou du corps"),
        ],
    },
    {
        "intro_fr": "Section 7. Forces du Xingyi, du Bajiquan et de la mante religieuse.",
        "terms": [
            ("横劲", "héng jìn", "force transversale"),
            ("竖劲", "shù jìn", "force verticale"),
            ("十字劲", "shízì jìn", "force en croix"),
            ("裂劲", "liè jìn", "force qui déchire"),
            ("翻浪劲", "fānlàng jìn", "force de vague renversante"),
            ("铁劲", "tiě jìn", "force de fer"),
            ("柔劲", "róu jìn", "force souple"),
            ("刚劲", "gāng jìn", "force dure"),
        ],
    },
]

INTRO_FR = (
    "Bienvenue dans ce glossaire audio des Jìn, les qualités de force structurée "
    "dans les arts martiaux chinois. Chaque terme est prononcé en chinois, puis en pinyin, "
    "puis traduit en français. Écoutez, répétez, puis essayez de sentir la qualité de force."
)

OUTRO_FR = (
    "Fin du glossaire. Travaillez chaque Jìn lentement. Le Jìn n'est pas seulement une technique, "
    "c'est une façon intelligente d'exprimer la puissance du corps entier."
)


def silence(ms):
    return AudioSegment.silent(duration=ms)


def tts(text, lang, slow=False):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        filename = tmp.name
    try:
        gTTS(text=text, lang=lang, slow=slow).save(filename)
        return AudioSegment.from_mp3(filename)
    finally:
        if os.path.exists(filename):
            os.unlink(filename)


def fr(text):
    return tts(text, "fr", slow=False)


def zh(text, slow=False):
    return tts(text, "zh-CN", slow=slow)


def build_term(chinese, pinyin, meaning_fr):
    audio = AudioSegment.empty()

    # Mandarin lent
    audio += zh(chinese, slow=True)
    audio += silence(PAUSE_SHORT)

    # Mandarin normal
    audio += zh(chinese, slow=False)
    audio += silence(PAUSE_SHORT)

    # Pinyin prononcé en français
    audio += fr(f"Pinyin : {pinyin}.")
    audio += silence(PAUSE_MEDIUM)

    # Sens français
    audio += fr(f"En français : {meaning_fr}.")
    return audio


def generate_all():
    """Génère le fichier audio MP3 complet avec tous les jins."""
    output_mp3 = "Jin_Glossaire_Mandarin_Francais.mp3"

    full = AudioSegment.empty()
    full += fr(INTRO_FR)
    full += silence(PAUSE_SECTION)

    total = sum(len(s["terms"]) for s in SECTIONS)
    count = 0

    for section in SECTIONS:
        print(section["intro_fr"])
        full += fr(section["intro_fr"])
        full += silence(PAUSE_SECTION)

        for chinese, pinyin, meaning in section["terms"]:
            count += 1
            print(f"{count}/{total}: {chinese} - {pinyin}")
            full += build_term(chinese, pinyin, meaning)
            full += silence(PAUSE_LONG)

        full += silence(PAUSE_SECTION)

    full += fr(OUTRO_FR)
    full += silence(1500)

    full = normalize(full)
    full = full.set_frame_rate(44100).set_channels(2)

    full.export(output_mp3, format="mp3", bitrate="192k")

    print(f"\n✅ Créé : {output_mp3}")
    print(f"📊 Durée : {len(full) / 1000 / 60:.1f} minutes")


def get_all_terms():
    """Retourne une liste plate de tous les termes avec leur index."""
    all_terms = []
    for section in SECTIONS:
        for chinese, pinyin, meaning in section["terms"]:
            all_terms.append((chinese, pinyin, meaning, section["intro_fr"]))
    return all_terms


def get_safe_pinyin_filename(pinyin):
    """Retourne un fragment de nom de fichier sûr à partir du pinyin."""
    safe_name = pinyin.replace(" ", "_")
    accents = {
        "ā": "a", "á": "a", "ǎ": "a", "à": "a",
        "ē": "e", "é": "e", "ě": "e", "è": "e",
        "ī": "i", "í": "i", "ǐ": "i", "ì": "i",
        "ō": "o", "ó": "o", "ǒ": "o", "ò": "o",
        "ū": "u", "ú": "u", "ǔ": "u", "ù": "u",
        "ǖ": "v", "ǘ": "v", "ǚ": "v", "ǜ": "v", "ü": "v",
    }
    for accent, plain in accents.items():
        safe_name = safe_name.replace(accent, plain)
    return "".join(c for c in safe_name if c.isalnum() or c == "_")


def get_single_output_mp3(pinyin):
    return f"Jin_{get_safe_pinyin_filename(pinyin)}.mp3"


def generate_single(index, all_terms):
    """Génère un fichier audio MP3 pour un seul jin."""
    chinese, pinyin, meaning, section_intro = all_terms[index]

    output_mp3 = get_single_output_mp3(pinyin)

    print(f"\n🎵 Génération de : {chinese} ({pinyin})")
    print(f"   Section : {section_intro}")

    full = AudioSegment.empty()
    full += fr(f"Jin numéro {index + 1}.")
    full += silence(PAUSE_MEDIUM)
    full += build_term(chinese, pinyin, meaning)
    full += silence(1500)

    full = normalize(full)
    full = full.set_frame_rate(44100).set_channels(2)

    full.export(output_mp3, format="mp3", bitrate="192k")

    print(f"✅ Créé : {output_mp3}")
    print(f"📊 Durée : {len(full) / 1000:.1f} secondes")


def menu():
    print("=" * 50)
    print("   🥋 Générateur Audio des Jìn (劲)")
    print("=" * 50)
    print()
    print("Que veux-tu faire ?")
    print()
    print("  1️⃣  Générer TOUS les sons (glossaire complet)")
    print("  2️⃣  Choisir UN jin dans la liste")
    print()

    while True:
        choice = input("Ton choix (1 ou 2) : ").strip()
        if choice in ("1", "2"):
            return choice
        print("❌ Choix invalide. Tape 1 ou 2.")


def choose_jin(all_terms):
    print("\n" + "=" * 50)
    print("   📜 Liste des Jìn")
    print("=" * 50)
    print()

    current_section = None
    for i, (chinese, pinyin, meaning, section_intro) in enumerate(all_terms, 1):
        if section_intro != current_section:
            current_section = section_intro
            print(f"\n   📂 {current_section}\n")
        print(f"   {i:2d}. {chinese}  ({pinyin}) — {meaning}")

    print()
    while True:
        choice = input(f"Choisis un numéro (1-{len(all_terms)}) : ").strip()
        if choice.isdigit():
            idx = int(choice) - 1
            if 0 <= idx < len(all_terms):
                return idx
        print(f"❌ Numéro invalide. Choisis entre 1 et {len(all_terms)}.")


def main():
    all_terms = get_all_terms()

    choice = menu()

    if choice == "1":
        print("\n🎙️ Génération du glossaire COMPLET...")
        generate_all()
    elif choice == "2":
        idx = choose_jin(all_terms)
        generate_single(idx, all_terms)

    print("\n🏁 Terminé !")


if __name__ == "__main__":
    main()
