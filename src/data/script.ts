import fs from "fs";
import path from "path";
import {
    BlockType,
    SongBlockType,
    SongTextType,
    SongType,
} from "@/shared/types";
import { formatChord, transposeChordsString } from "@/utils/chord";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const chordRx2 =
    /[A-H](b|#)?(maj|min|m|M|\+|-|dim|aug)?[0-9]*(sus)?[0-9]*(\/[A-H](b|#)?)?/;

const SECTION_SEPARATOR = "@";
const SONG_SEPARATOR = "________________";
const DEFAULT_KEY_SEPARATOR = "!!";

class Song {
    private fullText: string = "";
    private title: string = "";
    private key: string = "";
    private defaultKey: string | null = null;
    private blocks: SongBlockType[] = [];

    constructor(fullText: string) {
        this.fullText = fullText;
    }

    public parseSong() {
        const splitData = this.fullText.split(SECTION_SEPARATOR);
        const titleText = (splitData.at(0) as string).trim();
        const [title, defaultKey] = titleText.split(DEFAULT_KEY_SEPARATOR);

        this.title = title.trim();

        if (defaultKey) {
            this.defaultKey = defaultKey.trim();
        }

        for (let i = 1; i < splitData.length; i++) {
            const el = splitData[i];
            if (!el) continue;
            const lines = el.split("\n");
            const title = lines[0].trim();
            const text = this.parseText(lines.slice(1));

            this.blocks.push({ title, text });
        }

        return {
            title: this.title,
            key: this.defaultKey || this.key,
            blocks: this.blocks,
        };
    }

    private parseText(text: string[]): SongTextType[] {
        const data: SongTextType[] = [];

        for (let i = 0; i < text.length; i++) {
            const el = text[i];
            const str = el.trim();
            const nextStr = text[i + 1] ? text[i + 1].trim() : "";
            const chords = str.split(" ").filter((el) => el.trim());
            if (chords.length && chordRx2.test(chords.at(0) as string)) {
                if (!this.key) {
                    const [chord] = chords;
                    if (chord[1] === "#") {
                        this.key = formatChord(chord.slice(0, 2));
                    } else {
                        this.key = formatChord(chord[0]);
                    }
                }

                data.push({
                    type: BlockType.chords,
                    text: transposeChordsString(
                        el,
                        this.key,
                        this.defaultKey || this.key
                    ),
                });
            } else if (!str && nextStr && i !== 0) {
                data.push({
                    type: BlockType.text,
                    text: " ",
                });
            } else if (str) {
                data.push({
                    type: BlockType.text,
                    text: el,
                });
            }
        }

        return data;
    }
}

function compare(a: Omit<SongType, "index">, b: Omit<SongType, "index">) {
    return a.title.localeCompare(b.title);
}

async function main() {
    const filePath = path.join(__dirname, "songs.txt");
    const songs = fs.readFileSync(filePath, {
        encoding: "utf-8",
    });

    const songsArray = songs.split(SONG_SEPARATOR);
    const data = songsArray
        .map((el) => new Song(el).parseSong())
        .sort(compare)
        .map((song: Omit<SongType, "index">, i: number) => ({
            ...song,
            index: i,
        }));

    const songsPath = path.join(__dirname, "songs.json");

    fs.writeFileSync(songsPath, JSON.stringify(data));
}

main();
