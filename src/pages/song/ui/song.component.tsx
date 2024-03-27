import { FC } from "react";
import styles from "./song.module.scss";

import { SongView } from "@/features/song-view";
import { ArrowBack } from "@/features/arrow-back";
import { ShareBtn } from "@/features/share-btn";
import { SongType } from "@/shared/types";

type SongPageProps = {
    id: string;
    song: SongType;
};

export const SongPage: FC<SongPageProps> = ({ id, song }) => {
    return (
        <div className={""}>
            <div className={styles.header}>
                <ArrowBack />
                <span>№{+id + 1}</span>
                <ShareBtn title={song.title} />
            </div>
            <div className={styles.songList__wrapper}>
                <div className={styles.songList__container}>
                    <SongView song={song as SongType} />
                </div>
            </div>
        </div>
    );
};
