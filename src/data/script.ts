import fs from "fs";
import path from "path";
import { SongType } from "@/shared/types";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { fetchSongs } from "./supabase";
import { Song, SONG_SEPARATOR } from "./parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function compare(a: Omit<SongType, "index">, b: Omit<SongType, "index">) {
    return a.title.localeCompare(b.title);
}

async function mainFromTxt() {
    const filePath = path.join(__dirname, "songs.txt");
    const songs = fs.readFileSync(filePath, {
        encoding: "utf-8",
    });

    const songsArray = songs.split(SONG_SEPARATOR);
    return songsArray
        .map((el) => new Song(el).parseSong())
        .sort(compare);
}

async function mainFromSupabase() {
    const rows = await fetchSongs();
    return rows.map((row) => {
        const header = row.key ? `${row.name} !! ${row.key}` : row.name;
        const fullText = `${header}\n${row.lyrics}`;
        return new Song(fullText).parseSong();
    });
}

async function main() {
    const useTxt = process.argv.includes("--txt");
    const hasEnv = process.env.SUPABASE_URL && process.env.SUPABASE_PUBLISHABLE_DEFAULT_KEY;

    let songs: Omit<SongType, "index">[];

    if (useTxt || !hasEnv) {
        if (!hasEnv && !useTxt) {
            console.log("Supabase env vars not found, falling back to TXT mode");
        }
        songs = await mainFromTxt();
    } else {
        songs = await mainFromSupabase();
    }

    const data = songs.map((song, i) => ({
        ...song,
        index: i,
    }));

    const songsPath = path.join(__dirname, "songs.json");
    fs.writeFileSync(songsPath, JSON.stringify(data));
    console.log(`Generated ${data.length} songs to songs.json`);
}

main();
