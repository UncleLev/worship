export type SongType = {
    title: string;
    key: string;
    blocks: SongBlockType[];
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
    chords = "chords",
    text = "text",
}
