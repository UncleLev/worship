const fs = require("fs");

const chordRx2 =
    /[A-H](b|#)?(maj|min|m|M|\+|-|dim|aug)?[0-9]*(sus)?[0-9]*(\/[A-H](b|#)?)?/;

/**
 *
 * @param {array} text
 * @returns {string}
 */
function parseText(text) {
    let data = "";
    for (let i = 0; i < text.length; i++) {
        const el = text[i];
        const str = el.trim();
        const nextStr = text[i + 1] ? text[i + 1].trim() : "";
        const chords = str.split(" ").filter((el) => el.trim());
        if (chords.length && chordRx2.test(chords.at(0))) {
            data += `<span class="chords">${el}</span>`;
        } else if (!str && nextStr) {
            data += `<span> </span>`;
        } else if (str) {
            data += `<span>${el}</span>`;
        }
    }

    return data;
}

function parseSong(song) {
    const splitData = song.split("@");

    const title = splitData.at(0).trim();
    const blocks = [];

    for (let i = 1; i < splitData.length; i++) {
        const el = splitData[i];
        if (!el) continue;
        const lines = el.split("\n");
        const title = lines[0].trim();
        const text = parseText(lines.slice(1));

        blocks.push({ title, text });
    }

    return {
        title,
        blocks,
    };
}

function compare(a, b) {
    return a.title.localeCompare(b.title);
}

async function main() {
    const songs = fs.readFileSync("./songs.txt", { encoding: "utf-8" });
    const songSeparator = "________________";

    const songsArray = songs.split(songSeparator);
    const data = songsArray
        .map(parseSong)
        .sort(compare)
        .map((song, i) => ({ ...song, index: i }));

    fs.writeFileSync("songs.json", JSON.stringify(data));
}

main();
