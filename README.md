# Jin's

Application graphique pour consulter un glossaire des Jin des arts martiaux chinois et écouter le nom de chaque force.

## Prérequis

- Python 3.10 ou plus récent.
- Une connexion Internet pour générer les fichiers audio avec `gTTS`.
- Une sortie audio fonctionnelle sur la machine.

## API, services et dépendances

### Service externe

- Google Text-to-Speech, utilisé via la bibliothèque `gTTS`.
  - Sert à générer les fichiers MP3 des noms de Jin.
  - Ne nécessite pas de clé API dans ce projet.
  - Nécessite Internet au moment de la génération audio.
  - Une fois le MP3 créé dans `audio/`, il peut être relu sans régénération.

### Dépendances Python à installer

Ces dépendances sont listées dans `requirements.txt` :

```bash
gTTS
pygame
```

- `gTTS` : génération des MP3 à partir du texte `audio_text`.
- `pygame` : lecture audio intégrée dans l'application, sans ouvrir le lecteur Windows par défaut.

### Modules Python standards utilisés

Aucune installation séparée n'est nécessaire pour ces modules :

- `tkinter` : interface graphique.
- `threading` : génération/lecture audio sans bloquer l'interface.
- `pathlib` : gestion des chemins de fichiers.
- `dataclasses` : modèle de données `JinEntry`.
- `re` et `unicodedata` : génération des identifiants et noms de fichiers.

## Installation

```bash
pip install -r requirements.txt
```

## Lancer l'interface graphique

```bash
python jins_gui.py
```

L'interface permet de :

- rechercher par chinois, pinyin, nom latinise ou famille ;
- sélectionner un Jin dans la liste ;
- afficher son détail pédagogique ;
- générer automatiquement le MP3 du nom si nécessaire ;
- lire le MP3 avec l'icône haut-parleur.

Les fichiers audio générés sont placés dans `audio/` et ignorés par Git.
