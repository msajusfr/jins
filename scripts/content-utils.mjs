export const locales = ["fr", "en", "zh"];

export const sectionKeys = [
  "shortDefinition",
  "detailedExplanation",
  "biomechanics",
  "drill",
  "martialApplication",
  "commonMistakes",
  "masteryMilestone",
];

export function toGeneratedTs(value) {
  return JSON.stringify(value, null, 2);
}
