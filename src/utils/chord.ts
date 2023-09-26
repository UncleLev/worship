export const scale = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
];

// TODO: indude "b"
export function formatChord(chord: string): string {
    if (chord === "H") {
        return "B";
    }
    if (chord === "Bb") {
        return "A#";
    }

    return chord;
}

function transposeChord(chord: string, amount: number): string {
    const chordValue = formatChord(chord);

    return chordValue.replace(/[CDEFGAB]#?/g, function (match) {
        const i = (scale.indexOf(match) + amount) % scale.length;
        return scale[i < 0 ? i + scale.length : i];
    });
}

export function toneDiff(originKey: string, transposeKey: string): number {
    const orIndex = scale.findIndex((value) => value === originKey);
    const trIndex = scale.findIndex((value) => value === transposeKey);
    if (orIndex === -1 || trIndex === -1) {
        throw new Error(`Can't find ${originKey} || ${transposeKey}`);
    }
    return trIndex - orIndex;
}

export function transposeChordsString(
    str: string,
    origin: string,
    target: string
): string {
    const amount = toneDiff(origin, target);
    if ([0, 22].includes(amount)) return str;
    let result = "";

    for (let i = 0; i < str.length; i++) {
        let s = str[i];
        if (!s.trim()) {
            result += s;
            continue;
        }

        if (["#"].includes(s)) {
            continue;
        }
        if (str[i + 1] === "#") {
            s = str[i] + str[i + 1];
        }

        result += transposeChord(s, amount);
    }
    return result;
}
