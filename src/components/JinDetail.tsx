import { useMemo, useState } from "react";
import { AudioButton } from "./AudioButton";
import { BookButton } from "./BookButton";
import { BookModal } from "./BookModal";
import { bookChapters } from "../data/bookChapters";
import type { Locale } from "../i18n";
import { localizeFamily, localizeJinText, sectionTitles } from "../i18n";
import type { JinEntry } from "../types";

type JinDetailProps = {
  jin: JinEntry;
  locale: Locale;
};

const sections: Array<keyof Pick<
  JinEntry,
  | "shortDefinition"
  | "detailedExplanation"
  | "biomechanics"
  | "drill"
  | "martialApplication"
  | "commonMistakes"
  | "masteryMilestone"
>> = [
  "shortDefinition",
  "detailedExplanation",
  "biomechanics",
  "drill",
  "martialApplication",
  "commonMistakes",
  "masteryMilestone",
];

export function JinDetail({ jin, locale }: JinDetailProps) {
  const [isBookOpen, setIsBookOpen] = useState(false);
  const chapter = useMemo(
    () => bookChapters.find((item) => item.chinese === jin.chinese),
    [jin.chinese],
  );

  return (
    <>
      <article className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-white/10 bg-panel/90 shadow-warm">
        <header className="relative border-b border-white/10 p-5 md:p-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-6xl font-bold leading-none text-rice md:text-7xl">{jin.chinese}</h2>
              <p className="mt-4 text-lg font-semibold text-gold">{jin.pinyin}</p>
              <p className="mt-1 text-sm text-rice/62">
                {jin.displayName} · {localizeFamily(jin.family, locale)}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <BookButton
                disabled={!chapter}
                locale={locale}
                onClick={() => {
                  if (chapter) {
                    setIsBookOpen(true);
                  }
                }}
              />
              <AudioButton jin={jin} />
            </div>
          </div>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-7">
          <div className="grid gap-5">
            {sections.map((key) => {
              const value = localizeJinText(jin, key, locale);
              if (!value || typeof value !== "string") {
                return null;
              }

              return (
                <section key={key} className="rounded-lg border border-white/8 bg-white/[0.035] p-4">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-gold/85">
                    {sectionTitles[locale][key]}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-rice/78">{value}</p>
                </section>
              );
            })}
          </div>
        </div>
      </article>
      {chapter && isBookOpen ? (
        <BookModal chapter={chapter} locale={locale} onClose={() => setIsBookOpen(false)} />
      ) : null}
    </>
  );
}
