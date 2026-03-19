import { createClient } from "@supabase/supabase-js";

interface SongRow {
    name: string;
    key: string | null;
    lyrics: string;
    sort_order: number;
}

export async function fetchSongs(): Promise<SongRow[]> {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    if (!url || !key) {
        throw new Error(
            "Missing SUPABASE_URL or SUPABASE_PUBLISHABLE_DEFAULT_KEY environment variables"
        );
    }

    const supabase = createClient(url, key);

    const { data, error } = await supabase
        .from("songs")
        .select("name, key, lyrics, sort_order")
        .order("sort_order", { ascending: true })
        .order("name", { ascending: true });

    if (error) {
        throw new Error(`Supabase fetch failed: ${error.message}`);
    }

    if (!data || data.length === 0) {
        throw new Error("No songs found in Supabase");
    }

    return data as SongRow[];
}
