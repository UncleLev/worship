import { useEffect, useState } from 'react';

import supabase from '@/shared/lib/supabase-browser';

import type { SongEntry } from './types';

const CACHE_PREFIX = 'songs_cache_';
const CACHE_KEY = `${CACHE_PREFIX}${process.env.NEXT_PUBLIC_BUILD_ID ?? 'dev'}`;

function purgeOldCaches() {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(CACHE_PREFIX) && k !== CACHE_KEY)
    .forEach((k) => localStorage.removeItem(k));
}

export function useSongList(): { songs: SongEntry[] } {
  const [songs, setSongs] = useState<SongEntry[]>([]);

  useEffect(() => {
    purgeOldCaches();

    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        const { songs: cachedSongs } = JSON.parse(cached);
        setSongs(cachedSongs);
      } catch {}
    }

    supabase
      .from('songs')
      .select('id, name, sort_order')
      .order('name', { ascending: true })
      .then(({ data: rows }) => {
        if (!rows) return;
        const entries = rows.map((r) => ({
          name: r.name as string,
          id: r.id as number,
          num: r.sort_order as number,
        }));
        setSongs(entries);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ songs: entries }));
      });
  }, []);

  return { songs };
}
