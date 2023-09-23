import { ArrowBack, ShareBtn } from "./_componets";

import styles from "./page.module.scss";

import data from "@/data/songs.json";
export async function generateStaticParams() {
    return data.map(({ index }) => ({
        id: String(index),
    }));
}

export default function Song({ params }: { params: { id: string } }) {
    const song = data[+params?.id];

    return (
        <div className={""}>
            <div className={styles.header}>
                <ArrowBack />
                <span>№{+params?.id + 1}</span>
                <ShareBtn
                    title={song.title}
                    text={song.blocks[0].text || song.blocks[1].text}
                />
            </div>
            <div className={styles.song}>
                <h2 className={styles.song__title}>{song?.title}</h2>
                {song.blocks.map((block, i) => (
                    <div key={i} className={styles.block}>
                        <span className={styles.block__title}>
                            {block.title}
                        </span>
                        {block.text && (
                            <div
                                className={styles.block__text}
                                dangerouslySetInnerHTML={{ __html: block.text }}
                            ></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
