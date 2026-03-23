import { useEffect, useState } from "react";

import supabase from "@/shared/lib/supabase-browser";

import type { SongEntry } from "./types";

const CACHE_KEY = "songs_cache";

export function useSongList(): { songs: SongEntry[] } {
  const [songs, setSongs] = useState<SongEntry[]>([]);

  useEffect(() => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { songs: cachedSongs } = JSON.parse(cached);
        setSongs(cachedSongs);
      } catch {}
    }

    supabase
      .from("songs")
      .select("id, name, sort_order")
      .order("name", { ascending: true })
      .then(({ data: rows }) => {
        if (!rows) return;
        const entries = rows.map((r) => ({
          name: r.name as string,
          id: r.id as number,
          num: r.sort_order as number,
        }));
        setSongs(entries);
        localStorage.setItem(
          CACHE_KEY,
          JSON.stringify({ songs: entries, updatedAt: Date.now() }),
        );
      });
  }, []);

  return { songs };
}
