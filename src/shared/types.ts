export type SongType = {
    id?: string;
    title: string;
    tonalityKey: string;
    index?: number;
    blocks: SongBlockType[];
    rawText: string;
};

export type SongBlockType = {
    title: string;
    text: SongTextType[];
};

export type SongTextType = {
    type: BlockType;
    text: string;
};

export enum BlockType {
    chords = "CHORDS",
    text = "TEXT",
}

export enum FilterEnum {
    random = "random",
    favorite = "favorite",
}