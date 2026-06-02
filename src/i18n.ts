import type { JinEntry } from "./types";

export type Locale = "fr" | "en" | "zh";

export const locales: Array<{ code: Locale; flag: string; label: string }> = [
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
];

export const uiText = {
  fr: {
    martialGlossary: "Glossaire martial",
    subtitle: (count: number, familyCount: number) =>
      `${count} qualités de force, ${familyCount} familles, une interface légère à partager sur mobile ou desktop.`,
    searchLabel: "Rechercher un Jìn",
    searchPlaceholder: "Chinois, pinyin, nom, famille...",
    instantSearch: "Recherche instantanée",
    countLabel: (count: number) => `${count} Jìn`,
    detailIntro: "Détail sur la force",
    emptyTitle: "Sélectionne une force",
    emptyBody: "Choisis un Jìn dans la liste pour afficher son détail, ses exercices et son application.",
  },
  en: {
    martialGlossary: "Martial glossary",
    subtitle: (count: number, familyCount: number) =>
      `${count} force qualities, ${familyCount} families, a lightweight interface for mobile and desktop sharing.`,
    searchLabel: "Search a Jìn",
    searchPlaceholder: "Chinese, pinyin, name, family...",
    instantSearch: "Instant search",
    countLabel: (count: number) => `${count} Jìn`,
    detailIntro: "Force detail",
    emptyTitle: "Select a force",
    emptyBody: "Choose a Jìn from the list to display its detail, drills, and application.",
  },
  zh: {
    martialGlossary: "武术劲力词汇",
    subtitle: (count: number, familyCount: number) =>
      `${count} 种劲力，${familyCount} 个类别，适合手机和桌面浏览。`,
    searchLabel: "搜索劲",
    searchPlaceholder: "汉字、拼音、名称、类别...",
    instantSearch: "即时搜索",
    countLabel: (count: number) => `${count} 个劲`,
    detailIntro: "劲力说明",
    emptyTitle: "请选择一种劲",
    emptyBody: "从列表中选择一种劲，查看说明、练习和用法。",
  },
} satisfies Record<Locale, Record<string, unknown>>;

export const sectionTitles: Record<Locale, Record<keyof Pick<
  JinEntry,
  | "shortDefinition"
  | "detailedExplanation"
  | "biomechanics"
  | "drill"
  | "martialApplication"
  | "commonMistakes"
  | "masteryMilestone"
>, string>> = {
  fr: {
    shortDefinition: "Définition",
    detailedExplanation: "Explication détaillée",
    biomechanics: "Biomécanique",
    drill: "Drill / exercice",
    martialApplication: "Application martiale",
    commonMistakes: "Erreurs fréquentes",
    masteryMilestone: "Jalon de maîtrise",
  },
  en: {
    shortDefinition: "Definition",
    detailedExplanation: "Detailed explanation",
    biomechanics: "Biomechanics",
    drill: "Drill / exercise",
    martialApplication: "Martial application",
    commonMistakes: "Common mistakes",
    masteryMilestone: "Mastery milestone",
  },
  zh: {
    shortDefinition: "定义",
    detailedExplanation: "详细说明",
    biomechanics: "身体力学",
    drill: "练习",
    martialApplication: "技击应用",
    commonMistakes: "常见错误",
    masteryMilestone: "掌握标志",
  },
};

const familyTranslations: Record<string, Record<Exclude<Locale, "fr">, string>> = {
  "Famille spiralée, rotative et enveloppante": { en: "Spiraling, rotating, and wrapping family", zh: "螺旋、旋转与包裹类" },
  "Famille collante, perceptive et de contrôle": { en: "Sticking, listening, and control family", zh: "粘连、听感与控制类" },
  "Famille d’émission, d’explosion et de pénétration": { en: "Issuing, explosive, and penetrating family", zh: "发放、爆发与穿透类" },
  "Famille lourde, descendante et unifiante": { en: "Heavy, descending, and unifying family", zh: "沉重、下行与整合类" },
  "Famille longue, extensive et traversante": { en: "Long, extending, and traversing family", zh: "长劲、伸展与贯通类" },
  "Huit jìn canoniques du taijiquan": { en: "Canonical eight Jìn of Taiji Quan", zh: "太极拳八法劲" },
  "Forces transverses des traditions Xingyi, Baji et Mantis": { en: "Transverse forces from Xingyi, Baji, and Mantis traditions", zh: "形意、八极与螳螂传统的横向劲力" },
  "Famille spiralée et enveloppante": { en: "Spiraling and wrapping family", zh: "螺旋与包裹类" },
  "Famille spiralée et pénétrante": { en: "Spiraling and penetrating family", zh: "螺旋与穿透类" },
  "Famille enveloppante": { en: "Wrapping family", zh: "包裹类" },
  "Famille circulaire": { en: "Circular family", zh: "圆转类" },
  "Famille rotative": { en: "Rotational family", zh: "旋转类" },
  "Famille collante et de contrôle": { en: "Sticking and control family", zh: "粘连控制类" },
  "Famille sensible et réactive": { en: "Listening and reactive family", zh: "听化反应类" },
  "Famille de neutralisation": { en: "Neutralizing family", zh: "化解类" },
  "Famille de guidage": { en: "Guiding family", zh: "引导类" },
  "Famille de contrôle": { en: "Control family", zh: "控制类" },
  "Famille explosive": { en: "Explosive family", zh: "爆发类" },
  "Famille courte et explosive": { en: "Short explosive family", zh: "短劲爆发类" },
  "Famille pénétrante": { en: "Penetrating family", zh: "穿透类" },
  "Famille directe": { en: "Direct force family", zh: "直进类" },
  "Famille élastique": { en: "Elastic family", zh: "弹性类" },
  "Famille vibratoire": { en: "Vibrating family", zh: "抖震类" },
  "Famille descendante": { en: "Descending family", zh: "下沉类" },
  "Famille de pression": { en: "Pressing family", zh: "按压类" },
  "Famille absorbante": { en: "Absorbing family", zh: "吞吸类" },
  "Famille absorbante et émissive": { en: "Absorbing and issuing family", zh: "吞吐类" },
  "Famille structurelle": { en: "Whole-body structure family", zh: "整体结构类" },
  "Huit forces du Taiji Quan": { en: "Eight forces of Taiji Quan", zh: "太极拳八劲" },
  "Xingyi, Baji et styles associés": { en: "Xingyi, Baji, and related styles", zh: "形意、八极及相关拳种" },
  "Qualités de texture": { en: "Texture qualities", zh: "劲力质感" },
};

export function localizeFamily(family: string, locale: Locale) {
  if (locale === "fr") {
    return family;
  }
  return familyTranslations[family]?.[locale] ?? family;
}

export function localizeJinText(jin: JinEntry, key: keyof JinEntry, locale: Locale) {
  const original = jin[key];
  if (locale === "fr" || typeof original !== "string") {
    return original;
  }

  const family = localizeFamily(jin.family, locale);

  if (locale === "en") {
    const values: Partial<Record<keyof JinEntry, string>> = {
      shortDefinition: `${jin.displayName} is a ${family.toLowerCase()} quality.`,
      detailedExplanation: `${jin.displayName} trains a precise martial quality expressed through structure, timing, and contact. It should be practiced slowly before being used under pressure.`,
      biomechanics: "Keep a stable root, a quiet center, relaxed shoulders, and a connected line from the feet through the kua, waist, and hands.",
      drill: "Practice the quality alone first, then repeat it with a partner using simple, readable pressure.",
      martialApplication: "Use this quality to change the opponent's balance, angle, or structure at the moment of contact.",
      commonMistakes: "Do not force with the arms, lose the axis, rush the timing, or confuse the outer shape with the internal quality.",
      masteryMilestone: "The force becomes clear, repeatable, and usable without visible effort.",
    };
    return values[key] ?? original;
  }

  const values: Partial<Record<keyof JinEntry, string>> = {
    shortDefinition: `${jin.chinese} 属于${family}。`,
    detailedExplanation: `${jin.chinese} 训练一种明确的劲力品质。练习时要以身法、时机和接触为核心，先慢后快，先松后整。`,
    biomechanics: "保持根基稳定，中轴安静，肩肘放松，使脚、胯、腰与手形成连续传递。",
    drill: "先单人慢练，再与同伴以简单压力反复体会。",
    martialApplication: "在接触瞬间改变对方的重心、角度或结构。",
    commonMistakes: "避免只用手臂发力、丢失中轴、过早加速，或把外形当成真正的劲。",
    masteryMilestone: "劲力清楚、可重复，并且不需要明显用力即可表达。",
  };
  return values[key] ?? original;
}
