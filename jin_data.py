from __future__ import annotations

from dataclasses import dataclass
import re
import unicodedata


@dataclass(frozen=True)
class JinEntry:
    id: str
    chinese: str
    pinyin: str
    display_name: str
    short_definition: str
    detailed_explanation: str
    family: str
    audio_text: str
    biomechanics: str = ""
    drill: str = ""
    martial_application: str = ""
    common_mistakes: str = ""
    mastery_milestone: str = ""


def latinize_pinyin(pinyin: str) -> str:
    normalized = unicodedata.normalize("NFD", pinyin)
    plain = "".join(char for char in normalized if unicodedata.category(char) != "Mn")
    return " ".join(part.capitalize() for part in plain.replace("ü", "u").split())


def slugify(text: str) -> str:
    normalized = unicodedata.normalize("NFD", text.lower())
    plain = "".join(char for char in normalized if unicodedata.category(char) != "Mn")
    plain = plain.replace("ü", "u")
    return re.sub(r"[^a-z0-9]+", "-", plain).strip("-")


_RAW_JINS = [
    ("磨劲", "mó jìn", "Mo Jin", "Force qui broie progressivement", "Famille spiralée et enveloppante"),
    ("磨盘劲", "mópán jìn", "Mo Pan Jin", "Force de meule circulaire utilisant la taille et le kua", "Famille spiralée et enveloppante"),
    ("缠劲", "chán jìn", "Chan Jin", "Force qui enroule et accroche la structure adverse", "Famille spiralée et enveloppante"),
    ("缠丝劲", "chánsī jìn", "Chan Si Jin", "Force du fil de soie, continue et spiralée", "Famille spiralée et enveloppante"),
    ("螺旋劲", "luóxuán jìn", "Luo Xuan Jin", "Force hélicoïdale qui traverse en spirale", "Famille spiralée et enveloppante"),
    ("钻劲", "zuān jìn", "Zuan Jin", "Force qui fore et entre dans l'angle faible", "Famille spiralée et pénétrante"),
    ("裹劲", "guǒ jìn", "Guo Jin", "Force qui enveloppe et ferme l'espace", "Famille enveloppante"),
    ("绕劲", "rào jìn", "Rao Jin", "Force circulaire qui contourne la résistance", "Famille circulaire"),
    ("旋劲", "xuán jìn", "Xuan Jin", "Force rotative courte autour de l'axe", "Famille rotative"),
    ("沾劲", "zhān jìn", "Zhan Jin", "Force adhérente qui garde le contact", "Famille collante et de contrôle"),
    ("黏劲", "nián jìn", "Nian Jin", "Force collante qui suit sans rupture", "Famille collante et de contrôle"),
    ("沾黏劲", "zhānnián jìn", "Zhan Nian Jin", "Contact adhérent et collant combiné", "Famille collante et de contrôle"),
    ("听劲", "tīng jìn", "Ting Jin", "Force d'écoute qui lit l'intention adverse", "Famille sensible et réactive"),
    ("化劲", "huà jìn", "Hua Jin", "Force de transformation qui neutralise", "Famille de neutralisation"),
    ("引劲", "yǐn jìn", "Yin Jin", "Force qui guide l'adversaire dans le vide", "Famille de guidage"),
    ("拿劲", "ná jìn", "Na Jin", "Force de saisie et de contrôle", "Famille de contrôle"),
    ("粘连劲", "zhānlián jìn", "Zhan Lian Jin", "Connexion collante continue", "Famille collante et de contrôle"),
    ("发劲", "fā jìn", "Fa Jin", "Émission brève et coordonnée de puissance", "Famille explosive"),
    ("爆劲", "bào jìn", "Bao Jin", "Force explosive soudaine", "Famille explosive"),
    ("寸劲", "cùn jìn", "Cun Jin", "Force très courte à distance minimale", "Famille courte et explosive"),
    ("透劲", "tòu jìn", "Tou Jin", "Force pénétrante qui traverse la surface", "Famille pénétrante"),
    ("冲劲", "chōng jìn", "Chong Jin", "Force de charge directe", "Famille directe"),
    ("崩劲", "bēng jìn", "Beng Jin", "Force qui éclate et brise la ligne", "Famille explosive"),
    ("弹劲", "tán jìn", "Tan Jin", "Force élastique de ressort", "Famille élastique"),
    ("抖劲", "dǒu jìn", "Dou Jin", "Force vibratoire ou secouante", "Famille vibratoire"),
    ("炸劲", "zhà jìn", "Zha Jin", "Force explosive brutale", "Famille explosive"),
    ("沉劲", "chén jìn", "Chen Jin", "Force lourde descendante", "Famille descendante"),
    ("坠劲", "zhuì jìn", "Zhui Jin", "Force qui fait tomber", "Famille descendante"),
    ("压劲", "yā jìn", "Ya Jin", "Force de pression structurée", "Famille de pression"),
    ("吞劲", "tūn jìn", "Tun Jin", "Force qui absorbe", "Famille absorbante"),
    ("吞吐劲", "tūntǔ jìn", "Tun Tu Jin", "Absorber puis rejeter", "Famille absorbante et émissive"),
    ("整劲", "zhěng jìn", "Zheng Jin", "Force unifiée du corps entier", "Famille structurelle"),
    ("掤劲", "péng jìn", "Peng Jin", "Force expansive et protectrice", "Huit forces du Taiji Quan"),
    ("捋劲", "lǚ jìn", "Lu Jin", "Force qui détourne et tire", "Huit forces du Taiji Quan"),
    ("挤劲", "jǐ jìn", "Ji Jin", "Compression vers l'avant", "Huit forces du Taiji Quan"),
    ("按劲", "àn jìn", "An Jin", "Pression descendante", "Huit forces du Taiji Quan"),
    ("采劲", "cǎi jìn", "Cai Jin", "Force d'arracher ou de cueillir", "Huit forces du Taiji Quan"),
    ("挒劲", "liè jìn", "Lie Jin", "Force qui sépare ou fend", "Huit forces du Taiji Quan"),
    ("肘劲", "zhǒu jìn", "Zhou Jin", "Force du coude", "Huit forces du Taiji Quan"),
    ("靠劲", "kào jìn", "Kao Jin", "Force d'épaule ou du corps", "Huit forces du Taiji Quan"),
    ("横劲", "héng jìn", "Heng Jin", "Force transversale", "Xingyi, Baji et styles associés"),
    ("竖劲", "shù jìn", "Shu Jin", "Force verticale", "Xingyi, Baji et styles associés"),
    ("十字劲", "shízì jìn", "Shi Zi Jin", "Force en croix", "Xingyi, Baji et styles associés"),
    ("裂劲", "liè jìn", "Lie Jin", "Force qui déchire", "Xingyi, Baji et styles associés"),
    ("翻浪劲", "fānlàng jìn", "Fan Lang Jin", "Force de vague renversante", "Xingyi, Baji et styles associés"),
    ("铁劲", "tiě jìn", "Tie Jin", "Force de fer", "Qualités de texture"),
    ("柔劲", "róu jìn", "Rou Jin", "Force souple", "Qualités de texture"),
    ("刚劲", "gāng jìn", "Gang Jin", "Force dure", "Qualités de texture"),
]

_DETAIL_OVERRIDES = {
    "mopan-jin": {
        "detailed_explanation": "Cercle large généré par la taille et le kua. Les bras servent de rayons autour d'un centre lourd. Cette force déplace la structure adverse et casse ses angles d'entrée.",
        "biomechanics": "Rotation du centre, respiration basse, coordination taille-kua-bras et maintien d'un axe stable.",
        "drill": "Grands cercles debout, bâton court autour du dantian, puis travail à deux mains en contact léger.",
        "martial_application": "Déplacer l'adversaire hors de ses appuis et ouvrir un angle d'entrée sans forcer avec les bras.",
        "common_mistakes": "Tourner seulement les bras, monter les épaules ou perdre le poids dans les pieds.",
        "mastery_milestone": "Déplacer la structure adverse sans accélération visible.",
    },
    "chan-si-jin": {
        "detailed_explanation": "Force continue de spirale fine. Elle relie les pieds, la taille, la colonne et les mains dans un mouvement sans rupture, comme un fil que l'on déroule sans le casser.",
        "biomechanics": "Alternance subtile d'ouverture et de fermeture, rotation des avant-bras et connexion constante au centre.",
        "drill": "Cercles de soie lents, changements de paume et marche avec spirale du kua.",
        "martial_application": "Coller, guider et transformer la force adverse tout en préparant une émission courte.",
        "common_mistakes": "Faire une jolie rotation externe sans racine ni transmission depuis les jambes.",
        "mastery_milestone": "La spirale reste perceptible même dans un geste très petit.",
    },
    "ting-jin": {
        "detailed_explanation": "Capacité à écouter par le contact. Le pratiquant reçoit l'information de direction, de tension et d'intention avant de répondre.",
        "biomechanics": "Relâchement actif, tonus élastique, attention dans les paumes et absence de réponse prématurée.",
        "drill": "Poussées de mains lentes avec consigne de suivre avant de transformer.",
        "martial_application": "Détecter l'engagement adverse et choisir entre absorber, guider ou émettre.",
        "common_mistakes": "Deviner, résister trop tôt ou confondre mollesse et écoute.",
        "mastery_milestone": "Le changement adverse est senti avant qu'il ne devienne visible.",
    },
    "fa-jin": {
        "detailed_explanation": "Émission courte d'une force déjà construite. Le corps entier se coordonne dans un instant précis, sans crispation ni préparation spectaculaire.",
        "biomechanics": "Racine, compression élastique, relâchement soudain, alignement et intention claire.",
        "drill": "Émissions courtes sur sac, paume sur partenaire stable, puis retour immédiat au relâchement.",
        "martial_application": "Projeter, désorganiser ou frapper à partir d'une fenêtre très courte.",
        "common_mistakes": "Chercher la puissance dans les épaules, pousser longtemps ou se raidir avant l'impact.",
        "mastery_milestone": "La force sort nette, courte, puis le corps redevient disponible.",
    },
    "peng-jin": {
        "detailed_explanation": "Force expansive qui maintient la structure vivante. Elle ne pousse pas seulement vers l'extérieur : elle crée un volume élastique qui protège l'axe.",
        "biomechanics": "Dos plein, poitrine relâchée, coudes lourds, expansion dans toutes les directions.",
        "drill": "Tenue de posture, poussées de mains avec volume stable, transitions lentes sans effondrement.",
        "martial_application": "Recevoir une pression sans se casser, détourner et préparer une transformation.",
        "common_mistakes": "Lever les épaules, gonfler la poitrine ou pousser avec rigidité.",
        "mastery_milestone": "La structure reste pleine sous pression sans devenir dure.",
    },
}


def _default_detail(display_name: str, short_definition: str, family: str) -> dict[str, str]:
    return {
        "detailed_explanation": f"{display_name} désigne une qualité de force travaillée dans les arts martiaux chinois. Elle organise le corps autour d'une intention précise : {short_definition.lower()}.",
        "biomechanics": "Racine stable, centre disponible, épaules relâchées et transmission continue entre les pieds, le kua, la taille et les mains.",
        "drill": "Répéter lentement la qualité seule, puis en contact avec un partenaire qui donne une pression simple et lisible.",
        "martial_application": "Utiliser cette qualité pour modifier l'équilibre, l'angle ou la structure adverse au moment du contact.",
        "common_mistakes": "Forcer avec les bras, perdre l'axe, accélérer trop tôt ou confondre la forme extérieure avec la qualité interne.",
        "mastery_milestone": "La force devient claire, reproductible et utilisable sans effort visible.",
    }


def _build_entries() -> list[JinEntry]:
    entries: list[JinEntry] = []
    used_ids: dict[str, int] = {}

    for chinese, pinyin, display_name, short_definition, family in _RAW_JINS:
        base_id = slugify(display_name)
        used_ids[base_id] = used_ids.get(base_id, 0) + 1
        entry_id = base_id if used_ids[base_id] == 1 else f"{base_id}-{used_ids[base_id]}"
        detail = _default_detail(display_name, short_definition, family)
        detail.update(_DETAIL_OVERRIDES.get(entry_id, {}))
        entries.append(
            JinEntry(
                id=entry_id,
                chinese=chinese,
                pinyin=pinyin,
                display_name=display_name,
                short_definition=short_definition,
                family=family,
                audio_text=display_name,
                **detail,
            )
        )
    return entries


JIN_ENTRIES = _build_entries()
