import { useEffect, useRef } from "react";

interface UseScrollRestoreConfig {
  data: unknown[];
  storageKey?: string;
  dataAttribute?: string;
}

export function useScrollRestore({
  data,
  storageKey = "songlist_clicked_id",
  dataAttribute = "data-song-id",
}: UseScrollRestoreConfig) {
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (data.length === 0) return;
    const savedId = sessionStorage.getItem(storageKey);
    if (savedId) {
      sessionStorage.removeItem(storageKey);
      const el = listRef.current?.querySelector(
        `[${dataAttribute}="${savedId}"]`,
      );
      if (el) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }
  }, [data, storageKey, dataAttribute]);

  const saveScrollId = (id: string | number) => {
    sessionStorage.setItem(storageKey, String(id));
  };

  return { listRef, saveScrollId };
}
