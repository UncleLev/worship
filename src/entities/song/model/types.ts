export type SongEntry = { name: string; id: number; num: number };

export type SongType = {
  title: string;
  key: string;
  index: number;
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
  chords = 'chords',
  text = 'text',
}
