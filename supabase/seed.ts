import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SECTION_SEPARATOR = "@";
const SONG_SEPARATOR = "________________";
const DEFAULT_KEY_SEPARATOR = "!!";

function escapeSql(str: string): string {
    return str.replace(/'/g, "''");
}

function main() {
    const filePath = path.join(__dirname, "..", "src", "data", "songs.txt");
    const songs = fs.readFileSync(filePath, { encoding: "utf-8" });
    const songsArray = songs.split(SONG_SEPARATOR);

    const inserts: string[] = [];

    songsArray.forEach((songText, i) => {
        const trimmed = songText.trim();
        if (!trimmed) return;

        const splitData = trimmed.split(SECTION_SEPARATOR);
        const titleText = (splitData[0] as string).trim();
        const [titleRaw, defaultKey] = titleText.split(DEFAULT_KEY_SEPARATOR);
        const name = titleRaw.trim();
        const key = defaultKey ? defaultKey.trim() : null;

        // lyrics = everything after the title line (all @sections)
        const firstSepIndex = trimmed.indexOf(SECTION_SEPARATOR);
        const lyrics = firstSepIndex !== -1 ? trimmed.slice(firstSepIndex) : "";

        const keyVal = key ? `'${escapeSql(key)}'` : "NULL";
        inserts.push(
            `INSERT INTO songs (name, key, lyrics, sort_order) VALUES ('${escapeSql(name)}', ${keyVal}, '${escapeSql(lyrics)}', ${i});`
        );
    });

    const output = inserts.join("\n");
    const outputPath = path.join(__dirname, "seed.sql");
    fs.writeFileSync(outputPath, output);
    console.log(`Generated ${inserts.length} INSERT statements to supabase/seed.sql`);
}

main();
