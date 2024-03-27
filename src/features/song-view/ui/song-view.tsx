"use client";
import { useLayoutEffect, useState } from "react";
import styles from "./song-view.module.scss";
import cs from "classnames";

import { ChordIcon } from "@/shared/ui/icons";
import { SongType } from "@/shared/types";
import SongBlock from "./song-block/song-block";
import TonalitySelect from "./tonality-select/tonality-select";

type SongViewType = {
    className?: string;
    song: SongType;
};

const hideKey = "hide_chords";

export const SongView = ({ className, song }: SongViewType) => {
    const [hideChords, setHideChords] = useState(false);
    const [selectedKey, setSelectedKey] = useState(song.key);

    const handleHideChords = () => {
        setHideChords((state) => {
            localStorage.setItem(hideKey, JSON.stringify(!state));
            return !state;
        });
    };

    useLayoutEffect(() => {
        const hide = localStorage.getItem(hideKey) === "true";
        setHideChords(hide);
        setSelectedKey(song.key);
    }, [song.key]);

    return (
        <div className={cs(styles.song, className)}>
            <div className={styles.song}>
                <div className={styles.flowBtns}>
                    {!hideChords && (
                        <TonalitySelect
                            originKey={song.key}
                            transposeKey={selectedKey}
                            onKeyChange={setSelectedKey}
                        />
                    )}
                    <button
                        onClick={handleHideChords}
                        className={styles.flowBtns__hide}
                    >
                        <ChordIcon isActive={hideChords} />
                    </button>
                </div>
                <h2 className={styles.song__title}>{song.title}</h2>
                {song.blocks.map((block, i) => (
                    <div key={i} className={styles.block}>
                        <span className={styles.block__title}>
                            {block.title}
                        </span>
                        {!!block.text.length && (
                            <SongBlock
                                block={block}
                                hideChords={hideChords}
                                originKey={song.key}
                                selectedKey={selectedKey}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
