import { Metadata, ResolvingMetadata } from "next/types";

import { ArrowBack, ShareBtn, SongView } from "./_components";

import styles from "./page.module.scss";

import data from "@/data/songs.json";
export async function generateStaticParams() {
    return data.map(({ index }) => ({
        id: String(index),
    }));
}

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const id = params.id;
    const song = data[+id];

    return {
        title: song.title,
    };
}

export default function Song({ params }: { params: { id: string } }) {
    const song = data[+params?.id];
    return (
        <div className={""}>
            <div className={styles.header}>
                <ArrowBack />
                <span>№{+params?.id + 1}</span>
                <ShareBtn title={song.title} />
            </div>
            <div className={styles.songContainer}>
                <SongView song={song} />
            </div>
        </div>
    );
}
