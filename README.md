# Jin's

Application graphique pour consulter un glossaire des Jin des arts martiaux chinois et écouter le nom de chaque force.

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
