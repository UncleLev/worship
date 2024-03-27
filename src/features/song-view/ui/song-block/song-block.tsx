import cs from "classnames";

import { BlockType, SongBlockType } from "@/shared/types";

import { transposeChordsString } from "@/shared/lib/chord";

import styles from "./song-block.module.scss";

const Text = ({
    blockText,
    hideChords,
    originKey,
    selectedKey,
}: {
    blockText: {
        type: BlockType;
        text: string;
    };
    hideChords: boolean;
    originKey: string;
    selectedKey: string;
}) => {
    const isChords = blockText.type === BlockType.chords;
    const hide = hideChords && isChords;
    let value = blockText.text;

    if (!hide && hideChords) {
        const trimText = blockText.text.trim();
        value = trimText || "  ";
    }

    if (isChords) {
        value = transposeChordsString(blockText.text, originKey, selectedKey);
    }
    return (
        !hide && (
            <span className={cs(isChords && styles.text__chords)}>{value}</span>
        )
    );
};

type SongBlock = {
    className?: string;
    block: SongBlockType;
    hideChords: boolean;
    originKey: string;
    selectedKey: string;
};
const SongBlock = ({
    className,
    block,
    hideChords,
    originKey,
    selectedKey,
}: SongBlock) => {
    return (
        <div className={cs(styles.text, className)}>
            {block.text.map((el, i) => (
                <Text
                    key={`${el.text}-${i}`}
                    blockText={el}
                    hideChords={hideChords}
                    originKey={originKey}
                    selectedKey={selectedKey}
                />
            ))}
        </div>
    );
};

export default SongBlock;
