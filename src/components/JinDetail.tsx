import { AudioButton } from "./AudioButton";
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
  return (
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
          <AudioButton jin={jin} />
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
  );
}
