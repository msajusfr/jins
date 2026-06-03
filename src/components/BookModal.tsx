import { X } from "lucide-react";
import type { BookChapter } from "../data/bookChapters";
import type { Locale } from "../i18n";

type BookModalProps = {
  chapter: BookChapter;
  locale: Locale;
  onClose: () => void;
};

const labels: Record<Locale, { source: string; close: string; note: string }> = {
  fr: {
    source: "Source",
    close: "Fermer",
    note: "Texte du livre source. Les fichiers Markdown fournis sont en français.",
  },
  en: {
    source: "Source",
    close: "Close",
    note: "Source book text. The provided Markdown files are in French.",
  },
  zh: {
    source: "来源",
    close: "关闭",
    note: "书籍源文本。当前提供的 Markdown 文件为法语。",
  },
};

function renderMarkdown(markdown: string) {
  return markdown.split(/\n{2,}/).map((block, index) => {
    const text = block.trim();
    if (!text || text === "---") {
      return null;
    }

    if (text.startsWith("## ")) {
      return (
        <h2 key={index} className="text-3xl font-semibold leading-tight text-rice">
          {text.replace(/^##\s+/, "")}
        </h2>
      );
    }

    if (text.startsWith("### ")) {
      return (
        <h3 key={index} className="text-xl font-semibold text-gold">
          {text.replace(/^###\s+/, "")}
        </h3>
      );
    }

    if (text.startsWith(">")) {
      return (
        <blockquote key={index} className="border-l-2 border-gold/50 pl-4 text-rice/72">
          {text.replace(/^>\s?/gm, "")}
        </blockquote>
      );
    }

    return (
      <p key={index} className="text-sm leading-7 text-rice/78">
        {text}
      </p>
    );
  });
}

export function BookModal({ chapter, locale, onClose }: BookModalProps) {
  const text = labels[locale];

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-3 backdrop-blur-sm sm:items-center sm:p-6">
      <section className="mx-auto flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-white/10 bg-panel shadow-warm">
        <header className="flex items-start justify-between gap-4 border-b border-white/10 p-4 sm:p-5">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold/75">
              {text.source} · {chapter.file}
            </p>
            <h1 className="mt-2 text-2xl font-semibold text-rice">{chapter.title}</h1>
            <p className="mt-2 text-xs text-rice/45">{text.note}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label={text.close}
            title={text.close}
            className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-rice hover:bg-white/[0.08]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
          {renderMarkdown(chapter.markdown)}
        </div>
      </section>
    </div>
  );
}
