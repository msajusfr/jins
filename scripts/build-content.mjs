import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { locales, sectionKeys, toGeneratedTs } from "./content-utils.mjs";

const root = process.cwd();
const contentRoot = path.join(root, "content");
const generatedRoot = path.join(root, "src", "data", "generated");

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function readOptionalText(filePath) {
  try {
    return await readFile(filePath, "utf8");
  } catch (error) {
    if (error.code === "ENOENT") {
      return undefined;
    }
    throw error;
  }
}

function assertString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Missing ${label}`);
  }
}

function flattenJin(meta) {
  const entry = {
    id: meta.id,
    chinese: meta.chinese,
    pinyin: meta.pinyin,
    displayName: meta.displayName,
    shortDefinition: meta.sections?.shortDefinition?.fr ?? "",
    detailedExplanation: meta.sections?.detailedExplanation?.fr ?? "",
    family: meta.family?.fr ?? "",
    audioText: meta.audioText ?? meta.chinese,
  };

  for (const key of sectionKeys) {
    const value = meta.sections?.[key]?.fr;
    if (value && !(key in entry)) {
      entry[key] = value;
    }
  }

  return entry;
}

function localizedChapterFrom(meta, locale, markdown) {
  if (!markdown) {
    return undefined;
  }
  return {
    file: `content/jins/${meta.id}/chapter.${locale}.md`,
    title: `${meta.chinese} · ${meta.pinyin}`,
    markdown: markdown.trim(),
  };
}

async function readJinContent() {
  const dir = path.join(contentRoot, "jins");
  const ids = (await readdir(dir, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const entries = [];
  const chapters = [];
  const imageMap = {};

  for (const id of ids) {
    const jinDir = path.join(dir, id);
    const meta = await readJson(path.join(jinDir, "meta.json"));

    assertString(meta.id, `${id}/meta.json id`);
    assertString(meta.chinese, `${id}/meta.json chinese`);
    assertString(meta.pinyin, `${id}/meta.json pinyin`);
    assertString(meta.displayName, `${id}/meta.json displayName`);
    assertString(meta.family?.fr, `${id}/meta.json family.fr`);
    assertString(meta.sections?.shortDefinition?.fr, `${id}/meta.json sections.shortDefinition.fr`);
    assertString(meta.sections?.detailedExplanation?.fr, `${id}/meta.json sections.detailedExplanation.fr`);

    if (meta.id !== id) {
      throw new Error(`Directory ${id} contains meta id ${meta.id}`);
    }

    entries.push(flattenJin(meta));
    if (meta.image) {
      imageMap[meta.id] = meta.image;
    }

    const translations = {};
    for (const locale of locales) {
      const markdown = await readOptionalText(path.join(jinDir, `chapter.${locale}.md`));
      const chapter = localizedChapterFrom(meta, locale, markdown);
      if (chapter) {
        translations[locale] = chapter;
      }
    }

    if (!translations.fr) {
      throw new Error(`Missing content/jins/${id}/chapter.fr.md`);
    }

    chapters.push({
      chinese: meta.chinese,
      file: translations.fr.file,
      title: translations.fr.title,
      markdown: translations.fr.markdown,
      translations,
    });
  }

  const chineseKeys = new Set(chapters.map((chapter) => chapter.chinese));
  const missing = entries.filter((entry) => !chineseKeys.has(entry.chinese));
  if (missing.length > 0) {
    throw new Error(`Jìn entries missing chapters: ${missing.map((entry) => entry.id).join(", ")}`);
  }

  return { entries, chapters, imageMap };
}

async function readIntroduction() {
  const translations = {};
  for (const locale of locales) {
    const markdown = await readOptionalText(path.join(contentRoot, "book", `introduction.${locale}.md`));
    if (markdown) {
      translations[locale] = {
        file: `content/book/introduction.${locale}.md`,
        title: locale === "zh" ? "导言" : "Introduction",
        markdown: markdown.trim(),
      };
    }
  }

  if (!translations.fr) {
    throw new Error("Missing content/book/introduction.fr.md");
  }

  return {
    chinese: "introduction",
    file: translations.fr.file,
    title: translations.fr.title,
    markdown: translations.fr.markdown,
    translations,
  };
}

async function writeGenerated({ entries, chapters, imageMap, introduction }) {
  await mkdir(generatedRoot, { recursive: true });

  await writeFile(
    path.join(generatedRoot, "jins.generated.ts"),
    [
      'import type { JinEntry } from "../../types";',
      "",
      `export const jins: JinEntry[] = ${toGeneratedTs(entries)};`,
      "",
    ].join("\n"),
    "utf8",
  );

  await writeFile(
    path.join(generatedRoot, "bookChapters.generated.ts"),
    [
      "export type LocalizedBookChapter = {",
      "  file: string;",
      "  title: string;",
      "  markdown: string;",
      "};",
      "",
      "export type BookChapter = LocalizedBookChapter & {",
      "  chinese: string;",
      '  translations: Partial<Record<"fr" | "en" | "zh", LocalizedBookChapter>>;',
      "};",
      "",
      `export const bookChapters: BookChapter[] = ${toGeneratedTs(chapters)};`,
      "",
    ].join("\n"),
    "utf8",
  );

  await writeFile(
    path.join(generatedRoot, "bookIntroduction.generated.ts"),
    [
      'import type { BookChapter } from "./bookChapters.generated";',
      "",
      `export const bookIntroduction: BookChapter = ${toGeneratedTs(introduction)};`,
      "",
    ].join("\n"),
    "utf8",
  );

  await writeFile(
    path.join(generatedRoot, "jinImages.generated.ts"),
    [
      "export const jinImages: Record<string, string> = ",
      `${toGeneratedTs(imageMap)};`,
      "",
    ].join(""),
    "utf8",
  );
}

const { entries, chapters, imageMap } = await readJinContent();
const introduction = await readIntroduction();
await writeGenerated({ entries, chapters, imageMap, introduction });
console.log(`Generated ${entries.length} Jìn, ${chapters.length} chapters, ${Object.keys(imageMap).length} images.`);
