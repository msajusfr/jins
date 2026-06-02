# Jin's

Generateur audio des Jin des arts martiaux chinois, avec interface graphique.

## Installation

```bash
pip install -r requirements.txt
```

`pydub` a aussi besoin de `ffmpeg` installe sur la machine.

## Lancer l'interface graphique

```bash
python jins_gui.py
```

L'interface permet de :

- generer le glossaire complet ;
- generer un seul Jin choisi dans la liste ;
- choisir le dossier de sortie ;
- suivre les messages de generation.

## Lancer le menu console

```bash
python generate_jin_audio_gtts.py
```

Les fichiers `.mp3` et `.wav` generes sont ignores par Git.
