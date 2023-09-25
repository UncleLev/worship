"use client";
import cs from "classnames";
import { useLayoutEffect, useState } from "react";

import styles from "./song-view.module.scss";
import { ChordIcon } from "@/shared/icons";

type SongViewType = {
    className?: string;
    song: {
        title: string;
        blocks: { title: string; text?: string }[];
    };
};

const hideKey = "hide_chords";

const SongView = ({ className, song }: SongViewType) => {
    const [hideChords, setHideChords] = useState(false);

    const handleHideChords = () => {
        setHideChords((state) => {
            localStorage.setItem(hideKey, JSON.stringify(!state));
            return !state;
        });
    };

    useLayoutEffect(() => {
        const hide = localStorage.getItem(hideKey) === "true";
        setHideChords(hide);
    }, []);

    return (
        <div className={cs(styles.song, className)}>
            <div className={styles.song}>
                <div className={styles.flowBtns}>
                    <button
                        onClick={handleHideChords}
                        className={styles.flowBtns__hide}
                    >
                        <ChordIcon isActive={hideChords} />
                    </button>
                </div>
                <h2 className={styles.song__title}>{song?.title}</h2>
                {song.blocks.map((block, i) => (
                    <div key={i} className={styles.block}>
                        <span className={styles.block__title}>
                            {block.title}
                        </span>
                        {block.text && (
                            <div
                                className={cs(
                                    styles.block__text,
                                    hideChords && "hide"
                                )}
                                dangerouslySetInnerHTML={{ __html: block.text }}
                            ></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SongView;
