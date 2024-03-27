import { BlockType, SongBlockType, SongType } from "@/shared/types";

export const getFirstTextBlock = (song: SongType): string => {
    let result = "";
    for (let i = 0; i < song.blocks.length; i++) {
        const block = song.blocks[i];
        const text = filetChords(block);
        if (text.length > 0) {
            result = text.join("\n");
            break;
        }
    }

    return result.slice(0, 150) + "...";
};

const filetChords = (block: SongBlockType) => {
    return block.text
        .filter((text) => text.type !== BlockType.chords)
        .map((el) => el.text);
};
