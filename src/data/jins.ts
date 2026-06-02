import type { JinEntry } from "../types";

type RawJin = {
  chinese: string;
  pinyin: string;
  displayName: string;
  shortDefinition: string;
  family: string;
};

const rawJins: RawJin[] = [
  { chinese: "磨劲", pinyin: "mó jìn", displayName: "Mo Jin", shortDefinition: "Force qui broie progressivement", family: "Famille spiralée et enveloppante" },
  { chinese: "磨盘劲", pinyin: "mópán jìn", displayName: "Mo Pan Jin", shortDefinition: "Force de meule circulaire utilisant la taille et le kua", family: "Famille spiralée et enveloppante" },
  { chinese: "缠劲", pinyin: "chán jìn", displayName: "Chan Jin", shortDefinition: "Force qui enroule et accroche la structure adverse", family: "Famille spiralée et enveloppante" },
  { chinese: "缠丝劲", pinyin: "chánsī jìn", displayName: "Chan Si Jin", shortDefinition: "Force du fil de soie, continue et spiralée", family: "Famille spiralée et enveloppante" },
  { chinese: "螺旋劲", pinyin: "luóxuán jìn", displayName: "Luo Xuan Jin", shortDefinition: "Force hélicoïdale qui traverse en spirale", family: "Famille spiralée et enveloppante" },
  { chinese: "钻劲", pinyin: "zuān jìn", displayName: "Zuan Jin", shortDefinition: "Force qui fore et entre dans l'angle faible", family: "Famille spiralée et pénétrante" },
  { chinese: "裹劲", pinyin: "guǒ jìn", displayName: "Guo Jin", shortDefinition: "Force qui enveloppe et ferme l'espace", family: "Famille enveloppante" },
  { chinese: "绕劲", pinyin: "rào jìn", displayName: "Rao Jin", shortDefinition: "Force circulaire qui contourne la résistance", family: "Famille circulaire" },
  { chinese: "旋劲", pinyin: "xuán jìn", displayName: "Xuan Jin", shortDefinition: "Force rotative courte autour de l'axe", family: "Famille rotative" },
  { chinese: "沾劲", pinyin: "zhān jìn", displayName: "Zhan Jin", shortDefinition: "Force adhérente qui garde le contact", family: "Famille collante et de contrôle" },
  { chinese: "黏劲", pinyin: "nián jìn", displayName: "Nian Jin", shortDefinition: "Force collante qui suit sans rupture", family: "Famille collante et de contrôle" },
  { chinese: "沾黏劲", pinyin: "zhānnián jìn", displayName: "Zhan Nian Jin", shortDefinition: "Contact adhérent et collant combiné", family: "Famille collante et de contrôle" },
  { chinese: "听劲", pinyin: "tīng jìn", displayName: "Ting Jin", shortDefinition: "Force d'écoute qui lit l'intention adverse", family: "Famille sensible et réactive" },
  { chinese: "化劲", pinyin: "huà jìn", displayName: "Hua Jin", shortDefinition: "Force de transformation qui neutralise", family: "Famille de neutralisation" },
  { chinese: "引劲", pinyin: "yǐn jìn", displayName: "Yin Jin", shortDefinition: "Force qui guide l'adversaire dans le vide", family: "Famille de guidage" },
  { chinese: "拿劲", pinyin: "ná jìn", displayName: "Na Jin", shortDefinition: "Force de saisie et de contrôle", family: "Famille de contrôle" },
  { chinese: "粘连劲", pinyin: "zhānlián jìn", displayName: "Zhan Lian Jin", shortDefinition: "Connexion collante continue", family: "Famille collante et de contrôle" },
  { chinese: "发劲", pinyin: "fā jìn", displayName: "Fa Jin", shortDefinition: "Émission brève et coordonnée de puissance", family: "Famille explosive" },
  { chinese: "爆劲", pinyin: "bào jìn", displayName: "Bao Jin", shortDefinition: "Force explosive soudaine", family: "Famille explosive" },
  { chinese: "寸劲", pinyin: "cùn jìn", displayName: "Cun Jin", shortDefinition: "Force très courte à distance minimale", family: "Famille courte et explosive" },
  { chinese: "透劲", pinyin: "tòu jìn", displayName: "Tou Jin", shortDefinition: "Force pénétrante qui traverse la surface", family: "Famille pénétrante" },
  { chinese: "冲劲", pinyin: "chōng jìn", displayName: "Chong Jin", shortDefinition: "Force de charge directe", family: "Famille directe" },
  { chinese: "崩劲", pinyin: "bēng jìn", displayName: "Beng Jin", shortDefinition: "Force qui éclate et brise la ligne", family: "Famille explosive" },
  { chinese: "弹劲", pinyin: "tán jìn", displayName: "Tan Jin", shortDefinition: "Force élastique de ressort", family: "Famille élastique" },
  { chinese: "抖劲", pinyin: "dǒu jìn", displayName: "Dou Jin", shortDefinition: "Force vibratoire ou secouante", family: "Famille vibratoire" },
  { chinese: "炸劲", pinyin: "zhà jìn", displayName: "Zha Jin", shortDefinition: "Force explosive brutale", family: "Famille explosive" },
  { chinese: "沉劲", pinyin: "chén jìn", displayName: "Chen Jin", shortDefinition: "Force lourde descendante", family: "Famille descendante" },
  { chinese: "坠劲", pinyin: "zhuì jìn", displayName: "Zhui Jin", shortDefinition: "Force qui fait tomber", family: "Famille descendante" },
  { chinese: "压劲", pinyin: "yā jìn", displayName: "Ya Jin", shortDefinition: "Force de pression structurée", family: "Famille de pression" },
  { chinese: "吞劲", pinyin: "tūn jìn", displayName: "Tun Jin", shortDefinition: "Force qui absorbe", family: "Famille absorbante" },
  { chinese: "吞吐劲", pinyin: "tūntǔ jìn", displayName: "Tun Tu Jin", shortDefinition: "Absorber puis rejeter", family: "Famille absorbante et émissive" },
  { chinese: "整劲", pinyin: "zhěng jìn", displayName: "Zheng Jin", shortDefinition: "Force unifiée du corps entier", family: "Famille structurelle" },
  { chinese: "掤劲", pinyin: "péng jìn", displayName: "Peng Jin", shortDefinition: "Force expansive et protectrice", family: "Huit forces du Taiji Quan" },
  { chinese: "捋劲", pinyin: "lǚ jìn", displayName: "Lu Jin", shortDefinition: "Force qui détourne et tire", family: "Huit forces du Taiji Quan" },
  { chinese: "挤劲", pinyin: "jǐ jìn", displayName: "Ji Jin", shortDefinition: "Compression vers l'avant", family: "Huit forces du Taiji Quan" },
  { chinese: "按劲", pinyin: "àn jìn", displayName: "An Jin", shortDefinition: "Pression descendante", family: "Huit forces du Taiji Quan" },
  { chinese: "采劲", pinyin: "cǎi jìn", displayName: "Cai Jin", shortDefinition: "Force d'arracher ou de cueillir", family: "Huit forces du Taiji Quan" },
  { chinese: "挒劲", pinyin: "liè jìn", displayName: "Lie Jin", shortDefinition: "Force qui sépare ou fend", family: "Huit forces du Taiji Quan" },
  { chinese: "肘劲", pinyin: "zhǒu jìn", displayName: "Zhou Jin", shortDefinition: "Force du coude", family: "Huit forces du Taiji Quan" },
  { chinese: "靠劲", pinyin: "kào jìn", displayName: "Kao Jin", shortDefinition: "Force d'épaule ou du corps", family: "Huit forces du Taiji Quan" },
  { chinese: "横劲", pinyin: "héng jìn", displayName: "Heng Jin", shortDefinition: "Force transversale", family: "Xingyi, Baji et styles associés" },
  { chinese: "竖劲", pinyin: "shù jìn", displayName: "Shu Jin", shortDefinition: "Force verticale", family: "Xingyi, Baji et styles associés" },
  { chinese: "十字劲", pinyin: "shízì jìn", displayName: "Shi Zi Jin", shortDefinition: "Force en croix", family: "Xingyi, Baji et styles associés" },
  { chinese: "裂劲", pinyin: "liè jìn", displayName: "Lie Jin", shortDefinition: "Force qui déchire", family: "Xingyi, Baji et styles associés" },
  { chinese: "翻浪劲", pinyin: "fānlàng jìn", displayName: "Fan Lang Jin", shortDefinition: "Force de vague renversante", family: "Xingyi, Baji et styles associés" },
  { chinese: "铁劲", pinyin: "tiě jìn", displayName: "Tie Jin", shortDefinition: "Force de fer", family: "Qualités de texture" },
  { chinese: "柔劲", pinyin: "róu jìn", displayName: "Rou Jin", shortDefinition: "Force souple", family: "Qualités de texture" },
  { chinese: "刚劲", pinyin: "gāng jìn", displayName: "Gang Jin", shortDefinition: "Force dure", family: "Qualités de texture" },
];

const detailOverrides: Record<string, Partial<JinEntry>> = {
  "mo-pan-jin": {
    detailedExplanation: "Cercle large généré par la taille et le kua. Les bras servent de rayons autour d'un centre lourd. Cette force déplace la structure adverse et casse ses angles d'entrée.",
    biomechanics: "Rotation du centre, respiration basse, coordination taille-kua-bras et maintien d'un axe stable.",
    drill: "Grands cercles debout, bâton court autour du dantian, puis travail à deux mains en contact léger.",
    martialApplication: "Déplacer l'adversaire hors de ses appuis et ouvrir un angle d'entrée sans forcer avec les bras.",
    commonMistakes: "Tourner seulement les bras, monter les épaules ou perdre le poids dans les pieds.",
    masteryMilestone: "Déplacer la structure adverse sans accélération visible.",
  },
  "chan-si-jin": {
    detailedExplanation: "Force continue de spirale fine. Elle relie les pieds, la taille, la colonne et les mains dans un mouvement sans rupture, comme un fil que l'on déroule sans le casser.",
    biomechanics: "Alternance subtile d'ouverture et de fermeture, rotation des avant-bras et connexion constante au centre.",
    drill: "Cercles de soie lents, changements de paume et marche avec spirale du kua.",
    martialApplication: "Coller, guider et transformer la force adverse tout en préparant une émission courte.",
    commonMistakes: "Faire une jolie rotation externe sans racine ni transmission depuis les jambes.",
    masteryMilestone: "La spirale reste perceptible même dans un geste très petit.",
  },
  "ting-jin": {
    detailedExplanation: "Capacité à écouter par le contact. Le pratiquant reçoit l'information de direction, de tension et d'intention avant de répondre.",
    biomechanics: "Relâchement actif, tonus élastique, attention dans les paumes et absence de réponse prématurée.",
    drill: "Poussées de mains lentes avec consigne de suivre avant de transformer.",
    martialApplication: "Détecter l'engagement adverse et choisir entre absorber, guider ou émettre.",
    commonMistakes: "Deviner, résister trop tôt ou confondre mollesse et écoute.",
    masteryMilestone: "Le changement adverse est senti avant qu'il ne devienne visible.",
  },
  "fa-jin": {
    detailedExplanation: "Émission courte d'une force déjà construite. Le corps entier se coordonne dans un instant précis, sans crispation ni préparation spectaculaire.",
    biomechanics: "Racine, compression élastique, relâchement soudain, alignement et intention claire.",
    drill: "Émissions courtes sur sac, paume sur partenaire stable, puis retour immédiat au relâchement.",
    martialApplication: "Projeter, désorganiser ou frapper à partir d'une fenêtre très courte.",
    commonMistakes: "Chercher la puissance dans les épaules, pousser longtemps ou se raidir avant l'impact.",
    masteryMilestone: "La force sort nette, courte, puis le corps redevient disponible.",
  },
  "peng-jin": {
    detailedExplanation: "Force expansive qui maintient la structure vivante. Elle ne pousse pas seulement vers l'extérieur : elle crée un volume élastique qui protège l'axe.",
    biomechanics: "Dos plein, poitrine relâchée, coudes lourds, expansion dans toutes les directions.",
    drill: "Tenue de posture, poussées de mains avec volume stable, transitions lentes sans effondrement.",
    martialApplication: "Recevoir une pression sans se casser, détourner et préparer une transformation.",
    commonMistakes: "Lever les épaules, gonfler la poitrine ou pousser avec rigidité.",
    masteryMilestone: "La structure reste pleine sous pression sans devenir dure.",
  },
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function defaultDetail(jin: RawJin) {
  return {
    detailedExplanation: `${jin.displayName} désigne une qualité de force travaillée dans les arts martiaux chinois. Elle organise le corps autour d'une intention précise : ${jin.shortDefinition.toLowerCase()}.`,
    biomechanics: "Racine stable, centre disponible, épaules relâchées et transmission continue entre les pieds, le kua, la taille et les mains.",
    drill: "Répéter lentement la qualité seule, puis en contact avec un partenaire qui donne une pression simple et lisible.",
    martialApplication: "Utiliser cette qualité pour modifier l'équilibre, l'angle ou la structure adverse au moment du contact.",
    commonMistakes: "Forcer avec les bras, perdre l'axe, accélérer trop tôt ou confondre la forme extérieure avec la qualité interne.",
    masteryMilestone: "La force devient claire, reproductible et utilisable sans effort visible.",
  };
}

const idCounts = new Map<string, number>();

export const jins: JinEntry[] = rawJins.map((jin) => {
  const baseId = slugify(jin.displayName);
  const count = (idCounts.get(baseId) ?? 0) + 1;
  idCounts.set(baseId, count);
  const id = count === 1 ? baseId : `${baseId}-${count}`;

  return {
    id,
    ...jin,
    ...defaultDetail(jin),
    ...detailOverrides[id],
    audioText: jin.chinese,
  };
});
