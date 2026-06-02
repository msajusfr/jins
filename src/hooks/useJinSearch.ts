import { useMemo } from "react";
import type { JinEntry } from "../types";

export function useJinSearch(jins: JinEntry[], query: string) {
  return useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return jins;
    }

    return jins.filter((jin) =>
      [jin.chinese, jin.pinyin, jin.displayName, jin.family]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [jins, query]);
}
