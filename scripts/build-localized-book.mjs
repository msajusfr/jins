import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const bookRoot = path.join(root, "doc", "book");
const sourceRoot = path.join(bookRoot, "fr");

const sectionTitleMap = {
  en: {
    "Sommaire": "Table of Contents",
    "Introduction": "Introduction",
    "Conclusion": "Conclusion",
    "Première Partie": "Part One",
    "Deuxième Partie": "Part Two",
    "Troisième Partie": "Part Three",
    "Quatrième Partie": "Part Four",
    "Cinquième Partie": "Part Five",
    "Sixième Partie": "Part Six",
    "Septième Partie": "Part Seven",
    "Les forces d’écoute et de contact": "Listening and Contact Forces",
    "Les forces de neutralisation": "Neutralization Forces",
    "Les forces spirales et circulaires": "Spiral and Circular Forces",
    "Les forces de pénétration": "Penetrating Forces",
    "Les forces d’enveloppement et de contrôle": "Wrapping and Control Forces",
    "Les forces explosives": "Explosive Forces",
    "Les forces de transformation intérieure": "Forces of Inner Transformation",
    "Le corps qui devient chemin": "The Body Becoming a Path",
    "Le vrai livre est dans le corps": "The Real Book Is in the Body",
    "Les anciens parlaient peu": "The Ancients Spoke Little",
    "Le danger des mots": "The Danger of Words",
    "La lente transformation": "The Slow Transformation",
    "Ce qui relie tous les jìn": "What Connects All Jìn",
    "Quand la force devient calme": "When Force Becomes Calm",
    "La dernière porte": "The Last Gate",
    "Une dernière phrase, pour la route": "One Last Sentence for the Road",
    "Annexes": "Appendices",
    "Citations classiques essentielles": "Essential Classical Quotations",
    "Fin": "End",
  },
  zh: {
    "Sommaire": "目录",
    "Introduction": "导言",
    "Conclusion": "结语",
    "Première Partie": "第一部分",
    "Deuxième Partie": "第二部分",
    "Troisième Partie": "第三部分",
    "Quatrième Partie": "第四部分",
    "Cinquième Partie": "第五部分",
    "Sixième Partie": "第六部分",
    "Septième Partie": "第七部分",
    "Les forces d’écoute et de contact": "听感与接触之劲",
    "Les forces de neutralisation": "化解之劲",
    "Les forces spirales et circulaires": "螺旋与圆转之劲",
    "Les forces de pénétration": "穿透之劲",
    "Les forces d’enveloppement et de contrôle": "包裹与控制之劲",
    "Les forces explosives": "爆发之劲",
    "Les forces de transformation intérieure": "内在转化之劲",
    "Le corps qui devient chemin": "身体成为道路",
    "Le vrai livre est dans le corps": "真正的书在身体里",
    "Les anciens parlaient peu": "古人言少",
    "Le danger des mots": "文字的危险",
    "La lente transformation": "缓慢的转化",
    "Ce qui relie tous les jìn": "连接一切劲的东西",
    "Quand la force devient calme": "当力量变得安静",
    "La dernière porte": "最后一道门",
    "Une dernière phrase, pour la route": "临行前的一句话",
    "Annexes": "附录",
    "Citations classiques essentielles": "重要经典引文",
    "Fin": "终",
  },
};

const recurring = {
  en: [
    [/^Ce que vous prenez pour (.*)$/u, "What you may mistake for $1"],
    [/^Ce que disent les anciens$/u, "What the old masters say"],
    [/^Ce que disent les maîtres$/u, "What the masters say"],
    [/^Ce que disent les classiques$/u, "What the classics say"],
    [/^Ce qu’il faut retenir$/u, "What to remember"],
    [/^En pratique : quelques clés$/u, "In Practice: a Few Keys"],
    [/^Le sens de (.*)$/u, "The Meaning of $1"],
    [/^Pourquoi (.*)$/u, "Why $1"],
    [/^La sensation réelle du (.*)$/u, "The Real Feeling of $1"],
    [/^Le rôle (.*)$/u, "The Role $1"],
    [/^Le danger (.*)$/u, "The Danger $1"],
    [/^Chapitre · (.*)$/u, "Chapter · $1"],
  ],
  zh: [
    [/^Ce que vous prenez pour (.*)$/u, "你以为的$1"],
    [/^Ce que disent les anciens$/u, "古人怎么说"],
    [/^Ce que disent les maîtres$/u, "老师们怎么说"],
    [/^Ce que disent les classiques$/u, "经典怎么说"],
    [/^Ce qu’il faut retenir$/u, "需要记住的要点"],
    [/^En pratique : quelques clés$/u, "练习中的几个关键"],
    [/^Le sens de (.*)$/u, "$1 的含义"],
    [/^Pourquoi (.*)$/u, "为什么$1"],
    [/^La sensation réelle du (.*)$/u, "$1 的真实感觉"],
    [/^Le rôle (.*)$/u, "$1 的作用"],
    [/^Le danger (.*)$/u, "$1 的危险"],
    [/^Chapitre · (.*)$/u, "章节 · $1"],
  ],
};

const bookMeta = [
  {
    file: "00_Sommaire.md",
    enTitle: "Table of Contents",
    zhTitle: "目录",
    enBody: [
      "1. Introduction",
      "2. Part One: Listening and Contact Forces",
      "3. Part Two: Neutralization Forces",
      "4. Part Three: Spiral and Circular Forces",
      "5. Part Four: Penetrating Forces",
      "6. Part Five: Wrapping and Control Forces",
      "7. Part Six: Explosive Forces",
      "8. Part Seven: Forces of Inner Transformation",
      "9. Conclusion",
    ],
    zhBody: [
      "1. 导言",
      "2. 第一部分：听感与接触之劲",
      "3. 第二部分：化解之劲",
      "4. 第三部分：螺旋与圆转之劲",
      "5. 第四部分：穿透之劲",
      "6. 第五部分：包裹与控制之劲",
      "7. 第六部分：爆发之劲",
      "8. 第七部分：内在转化之劲",
      "9. 结语",
    ],
  },
  {
    file: "01_Introduction.md",
    enTitle: "Introduction",
    zhTitle: "导言",
    enBody: [
      "The old masters used the word *jìn* to describe organized force, not ordinary muscular strength. It is born from structure, timing, release, intention, and whole-body connection.",
      "*Lì* is raw strength. *Jìn* is strength that has been refined by the body. A strong person may have much *lì* and very little *jìn*; an apparently fragile master may express force that passes through the whole frame.",
      "The book classifies the main families of *jìn*: listening and contact, neutralization, spiral and circular movement, penetration, wrapping and control, explosive issuing, and inner transformation.",
      "Each chapter should be read as a practical guide: what the body feels, what the partner perceives, and how a named force becomes alive through practice.",
    ],
    zhBody: [
      "古人用“劲”来说明经过组织的力量，而不是单纯的肌肉力。劲来自结构、时机、松沉、意念以及全身的贯通。",
      "“力”是原始力量；“劲”是被身体炼化后的力量。一个强壮的人可以有很多力，却几乎没有劲；而真正有功夫的人，看似柔弱，接触时却能让力量贯通全身。",
      "本书把主要劲力分为几类：听感与接触、化解、螺旋圆转、穿透、包裹控制、爆发发放，以及内在转化。",
      "每一章都应作为练习指南来读：身体如何感受，对方如何感知，以及一个有名称的劲怎样通过训练变得真实。",
    ],
  },
  {
    file: "09_Conclusion.md",
    enTitle: "Conclusion",
    zhTitle: "结语",
    enBody: [
      "The study of *jìn* is not a collection of exotic terms. It is a way of making the body honest: connected, quiet, responsive, and precise.",
      "Words can point toward practice, but they cannot replace contact. The real book is written in the legs, the waist, the spine, the palms, and the breath.",
      "All *jìn* share a common thread: less isolated effort, more whole-body organization; less forcing, more listening; less display, more usable clarity.",
      "When force becomes calm, it no longer needs to announce itself. It appears at the right time, through the right structure, with the right amount.",
    ],
    zhBody: [
      "学习劲并不是收集奇特名词，而是让身体变得诚实：贯通、安静、灵敏、准确。",
      "文字只能指向练习，不能代替接触。真正的书写在腿、腰、脊柱、掌心和呼吸里。",
      "所有劲都有共同线索：少一点局部用力，多一点全身组织；少一点硬抗，多一点听感；少一点表演，多一点可用的清明。",
      "当力量变得安静，它就不需要宣告自己。它只是在正确的时机，通过正确的结构，以恰当的分量出现。",
    ],
  },
];

const partMeta = {
  "02_Premi_re_Partie.md": {
    enTitle: "Part One\n\n# Listening and Contact Forces",
    zhTitle: "第一部分\n\n# 听感与接触之劲",
    enIntro: "These forces teach the body to feel before acting: to listen, stick, adhere, and remain present without becoming rigid.",
    zhIntro: "这些劲训练身体先感知再行动：能听、能粘、能黏，在不僵硬的情况下保持临在。",
  },
  "03_Deuxi_me_Partie.md": {
    enTitle: "Part Two\n\n# Neutralization Forces",
    zhTitle: "第二部分\n\n# 化解之劲",
    enIntro: "Neutralization does not fight force head-on. It changes the relationship so the attack loses its effect.",
    zhIntro: "化解不是正面对抗力量，而是改变关系，使对方的攻击失去效果。",
  },
  "04_Troisi_me_Partie.md": {
    enTitle: "Part Three\n\n# Spiral and Circular Forces",
    zhTitle: "第三部分\n\n# 螺旋与圆转之劲",
    enIntro: "The straight line gives way to spirals. Rotation connects the limbs to the center and makes force difficult to grasp.",
    zhIntro: "直线让位于螺旋。旋转把四肢与中心连成一体，使力量难以被抓住。",
  },
  "05_Quatri_me_Partie.md": {
    enTitle: "Part Four\n\n# Penetrating Forces",
    zhTitle: "第四部分\n\n# 穿透之劲",
    enIntro: "Penetrating forces do not stop at the surface. They seek the center, the hidden opening, and the space behind tension.",
    zhIntro: "穿透之劲不止于表面。它寻找中心、隐藏的开口，以及紧张背后的空间。",
  },
  "06_Cinqui_me_Partie.md": {
    enTitle: "Part Five\n\n# Wrapping and Control Forces",
    zhTitle: "第五部分\n\n# 包裹与控制之劲",
    enIntro: "These forces close space without crude gripping. They reduce exits until the partner discovers that the structure is already held.",
    zhIntro: "这些劲不是粗暴抓握，而是在不知不觉中关闭空间，使对方发现结构已经被控制。",
  },
  "07_Sixi_me_Partie.md": {
    enTitle: "Part Six\n\n# Explosive Forces",
    zhTitle: "第六部分\n\n# 爆发之劲",
    enIntro: "Explosive force releases what has been stored by relaxation, connection, and timing. Without release, it is only fast tension.",
    zhIntro: "爆发之劲释放由松、整、时机所储存的力量。没有松沉，就只是快速紧张。",
  },
  "08_Septi_me_Partie.md": {
    enTitle: "Part Seven\n\n# Forces of Inner Transformation",
    zhTitle: "第七部分\n\n# 内在转化之劲",
    enIntro: "At this level, *jìn* is no longer only tactical. It becomes a way of inhabiting the body and refining presence.",
    zhIntro: "到这个层次，劲不再只是技击方法，而成为居于身体、涵养神意的一种方式。",
  },
};

function parseJins() {
  const source = globalThis.__jinsSource;
  const entries = [];
  const blocks = source.match(/\{\n\s+id:[\s\S]*?\n\s+\}/g) ?? [];
  for (const block of blocks) {
    const get = (key) => block.match(new RegExp(`${key}: "([\\s\\S]*?)"`))?.[1] ?? "";
    entries.push({
      id: get("id"),
      chinese: get("chinese"),
      pinyin: get("pinyin"),
      displayName: get("displayName"),
      shortDefinition: get("shortDefinition"),
      detailedExplanation: get("detailedExplanation"),
      family: get("family"),
      biomechanics: get("biomechanics"),
      drill: get("drill"),
      martialApplication: get("martialApplication"),
      commonMistakes: get("commonMistakes"),
      masteryMilestone: get("masteryMilestone"),
    });
  }
  return entries;
}

const familyTranslations = {
  "Famille spiralée, rotative et enveloppante": {
    en: "spiraling, rotating, and wrapping family",
    zh: "螺旋、旋转与包裹类",
  },
  "Famille collante, perceptive et de contrôle": {
    en: "sticking, listening, and control family",
    zh: "粘连、听感与控制类",
  },
  "Famille d’émission, d’explosion et de pénétration": {
    en: "issuing, explosive, and penetrating family",
    zh: "发放、爆发与穿透类",
  },
  "Famille lourde, descendante et unifiante": {
    en: "heavy, descending, and unifying family",
    zh: "沉重、下行与整合类",
  },
  "Famille longue, extensive et traversante": {
    en: "long, extending, and traversing family",
    zh: "长劲、伸展与贯通类",
  },
};

function translateHeading(text, locale) {
  const exact = sectionTitleMap[locale][text];
  if (exact) return exact;
  for (const [pattern, replacement] of recurring[locale]) {
    if (pattern.test(text)) {
      return text.replace(pattern, replacement);
    }
  }
  return text;
}

function translateSourceHeadings(markdown, locale) {
  return markdown.replace(/^(#{1,3})\s+(.+)$/gmu, (_, hashes, title) => {
    return `${hashes} ${translateHeading(title.trim(), locale)}`;
  });
}

function localizedJinBlock(jin, locale) {
  if (locale === "en") {
    const family = familyTranslations[jin.family]?.en ?? "internal force family";
    return [
      `## ${jin.chinese} · ${jin.pinyin}`,
      "",
      `### ${jin.displayName}`,
      "",
      `${jin.displayName} belongs to the ${family}. It trains a specific quality of force expressed through structure, timing, contact, and whole-body coordination.`,
      "",
      `**Definition.** A named quality of internal force. Its purpose is not to add brute strength, but to give the body a precise way to organize pressure and direction.`,
      "",
      `**Detailed explanation.** Practice ${jin.displayName} slowly until the shape, breath, center, and point of contact behave as one unit. The quality should be felt before it is accelerated.`,
      "",
      `**Biomechanics.** Keep the root stable, the center quiet, the shoulders released, and the line connected from the feet through the kua, waist, back, elbows, and hands.`,
      "",
      `**Drill.** Practice alone first with slow repetitions, then with a partner using simple, readable pressure. Do not increase speed before the contact remains clear.`,
      "",
      `**Martial application.** Use it to affect the opponent's balance, angle, timing, or structure at the point of contact.`,
      "",
      `**Common mistakes.** Avoid forcing with the arms, stiffening the chest, rushing the timing, and confusing the outer shape with the inner quality.`,
      "",
      `**Mastery milestone.** The quality becomes repeatable, readable by the body, and usable without visible effort.`,
    ].join("\n");
  }

  const family = familyTranslations[jin.family]?.zh ?? "内家劲力类别";
  return [
    `## ${jin.chinese} · ${jin.pinyin}`,
    "",
    `### ${jin.displayName}`,
    "",
    `${jin.chinese} 属于${family}。它训练一种明确的劲力品质，主要通过身法、时机、接触和全身协调来表达。`,
    "",
    `**定义。** 一种有名称的内在劲力品质。它的目的不是增加蛮力，而是让身体用更精确的方式组织压力与方向。`,
    "",
    `**详细说明。** 练习 ${jin.chinese} 时，应先慢后快，使外形、呼吸、中心与接触点成为一个整体。先让身体真正感觉到这种品质，再谈速度与应用。`,
    "",
    `**身体机制。** 根基稳定，中轴安静，肩肘放松，使力量从脚、胯、腰、背、肘到手连续贯通。`,
    "",
    `**练习。** 先单人慢练，再与同伴在清楚、可读的压力下反复体会。接触未清楚之前，不要急着加速。`,
    "",
    `**技击应用。** 在接触点改变对方的重心、角度、时机或结构。`,
    "",
    `**常见错误。** 避免只用手臂、胸口僵硬、抢时机，或把外在动作误认为真正的劲。`,
    "",
    `**掌握标志。** 该劲变得清楚、可重复，身体能识别，并且不需明显用力即可使用。`,
  ].join("\n");
}

function extractChapterNames(markdown) {
  const names = [];
  const re = /^# Chapitre · (.+)$/gmu;
  let match;
  while ((match = re.exec(markdown))) {
    names.push(match[1].normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().replace(/\s+/g, "-"));
  }
  return names;
}

async function ensureFrenchFolder() {
  await mkdir(sourceRoot, { recursive: true });
  const rootFiles = (await readdir(bookRoot)).filter((file) => file.endsWith(".md"));
  for (const file of rootFiles) {
    const target = path.join(sourceRoot, file);
    if (!existsSync(target)) {
      const content = await readFile(path.join(bookRoot, file), "utf8");
      await writeFile(target, content, "utf8");
    }
  }
}

async function build() {
  await ensureFrenchFolder();
  globalThis.__jinsSource = await readFile(path.join(root, "src", "data", "jins.ts"), "utf8");
  const jins = parseJins();

  for (const locale of ["en", "zh"]) {
    const outRoot = path.join(bookRoot, locale);
    await mkdir(outRoot, { recursive: true });

    for (const meta of bookMeta) {
      const title = locale === "en" ? meta.enTitle : meta.zhTitle;
      const body = locale === "en" ? meta.enBody : meta.zhBody;
      await writeFile(path.join(outRoot, meta.file), `# ${title}\n\n${body.join("\n\n")}\n`, "utf8");
    }

    for (const [file, meta] of Object.entries(partMeta)) {
      const source = await readFile(path.join(sourceRoot, file), "utf8");
      const chapterNames = extractChapterNames(source);
      const blocks = chapterNames
        .map((name) => jins.find((jin) => jin.id === name))
        .filter(Boolean)
        .map((jin) => localizedJinBlock(jin, locale));
      const title = locale === "en" ? meta.enTitle : meta.zhTitle;
      const intro = locale === "en" ? meta.enIntro : meta.zhIntro;
      const content = [`# ${title}`, "", intro, "", "---", "", ...blocks].join("\n");
      await writeFile(path.join(outRoot, file), `${content.trim()}\n`, "utf8");
    }
  }
}

await build();
