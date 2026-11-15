export interface SongRow {
  id: number;
  name: string;
  key: string | null;
  lyrics: string;
  sort_order: number;
}

function getEnv() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY;
  if (!url || !key) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_DEFAULT_KEY environment variables',
    );
  }
  return { url, key };
}

// Next caches fetches during static generation and .next/cache is restored
// between CI builds, so a stale Supabase response could be reused forever.
// Headers are part of the fetch cache key: a per-build value forces fresh data.
const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID ?? String(Date.now());

const SELECT = 'id,name,key,lyrics,sort_order';

export async function fetchSongs(): Promise<SongRow[]> {
  const { url, key } = getEnv();

  const res = await fetch(
    `${url}/rest/v1/songs?select=${SELECT}&order=sort_order.asc,name.asc`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'x-build-id': BUILD_ID,
      },
    },
  );

  if (!res.ok) throw new Error(`Supabase fetch failed: ${res.statusText}`);

  const data: SongRow[] = await res.json();

  if (!data || data.length === 0) throw new Error('No songs found in Supabase');

  return data;
}

export async function fetchSongById(id: number): Promise<SongRow | null> {
  const { url, key } = getEnv();

  const res = await fetch(
    `${url}/rest/v1/songs?select=${SELECT}&id=eq.${id}`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Accept: 'application/vnd.pgrst.object+json',
        'x-build-id': BUILD_ID,
      },
    },
  );

  if (res.status === 406 || res.status === 404) return null;
  if (!res.ok) return null;

  return res.json();
}
