import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const bookRoot = path.join(root, "doc", "book");
const outFile = path.join(root, "src", "data", "bookChapters.ts");
const introOutFile = path.join(root, "src", "data", "bookIntroduction.ts");
const locales = ["fr", "en", "zh"];

function parseChapterBlocks(markdown, file) {
  const markers = [...markdown.matchAll(/^##\s+([\p{Script=Han}]+)\s+·\s+(.+)$/gmu)].map((match) => ({
    chinese: match[1],
    title: `${match[1]} · ${match[2].trim()}`,
    index: match.index ?? 0,
  }));

  return markers.map((marker, index) => {
    const next = markers[index + 1]?.index ?? markdown.length;
    return {
      chinese: marker.chinese,
      file,
      title: marker.title,
      markdown: markdown.slice(marker.index, next).trim(),
    };
  });
}

function mergeByChinese(entriesByLocale) {
  const byChinese = new Map();
  for (const locale of locales) {
    for (const entry of entriesByLocale[locale]) {
      const key = entry.chinese;
      const current = byChinese.get(key) ?? {
        chinese: key,
        file: entry.file,
        title: entry.title,
        markdown: entry.markdown,
        translations: {},
      };
      current.translations[locale] = {
        file: entry.file,
        title: entry.title,
        markdown: entry.markdown,
      };
      if (locale === "fr") {
        current.file = entry.file;
        current.title = entry.title;
        current.markdown = entry.markdown;
      }
      byChinese.set(key, current);
    }
  }

  const aliases = [
    ["沾劲", "粘劲"],
    ["拿劲", "缠拿劲"],
  ];

  for (const [alias, target] of aliases) {
    if (!byChinese.has(alias) && byChinese.has(target)) {
      byChinese.set(alias, { ...byChinese.get(target), chinese: alias });
    }
  }

  return [...byChinese.values()];
}

function serialize(value) {
  return JSON.stringify(value, null, 2);
}

async function readBookFiles(locale) {
  const dir = path.join(bookRoot, locale);
  const files = (await readdir(dir)).filter((file) => file.endsWith(".md")).sort();
  const entries = [];
  let introduction;

  for (const file of files) {
    const markdown = await readFile(path.join(dir, file), "utf8");
    if (file === "01_Introduction.md") {
      const firstHeading = markdown.match(/^#\s+(.+)$/m)?.[1] ?? "Introduction";
      introduction = {
        chinese: "introduction",
        file,
        title: firstHeading,
        markdown: markdown.trim(),
      };
    }
    entries.push(...parseChapterBlocks(markdown, file));
  }

  return { entries, introduction };
}

const entriesByLocale = {};
const introductions = {};

for (const locale of locales) {
  const data = await readBookFiles(locale);
  entriesByLocale[locale] = data.entries;
  introductions[locale] = data.introduction;
}

const bookChapters = mergeByChinese(entriesByLocale);
const frIntro = introductions.fr;
const bookIntroduction = {
  ...frIntro,
  translations: Object.fromEntries(
    locales.map((locale) => [
      locale,
      {
        file: introductions[locale].file,
        title: introductions[locale].title,
        markdown: introductions[locale].markdown,
      },
    ]),
  ),
};

await writeFile(
  outFile,
  [
    "export type LocalizedBookChapter = {",
    "  file: string;",
    "  title: string;",
    "  markdown: string;",
    "};",
    "",
    "export type BookChapter = LocalizedBookChapter & {",
    "  chinese: string;",
    "  translations: Partial<Record<\"fr\" | \"en\" | \"zh\", LocalizedBookChapter>>;",
    "};",
    "",
    `export const bookChapters: BookChapter[] = ${serialize(bookChapters)};`,
    "",
  ].join("\n"),
  "utf8",
);

await writeFile(
  introOutFile,
  [
    'import type { BookChapter } from "./bookChapters";',
    "",
    `export const bookIntroduction: BookChapter = ${serialize(bookIntroduction)};`,
    "",
  ].join("\n"),
  "utf8",
);

console.log(`Generated ${bookChapters.length} localized book chapters.`);
