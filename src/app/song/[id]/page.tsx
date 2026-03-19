import { Metadata } from "next/types";

import { ArrowBack, ShareBtn, SongView } from "./_components";

import styles from "./page.module.scss";

import { SongType } from "@/shared/types";

import { getFirstTextBlock } from "@/utils/text";

import { fetchSongs } from "@/data/supabase";
import { parseSongRow } from "@/data/parser";

export async function generateStaticParams() {
    const rows = await fetchSongs();
    return rows.map((_, index) => ({
        id: String(index),
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const rows = await fetchSongs();
    const song = parseSongRow(rows[+id], +id);

    return {
        title: song.title,
        description: getFirstTextBlock(song),
    };
}

export default async function Song({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const rows = await fetchSongs();
    const song = parseSongRow(rows[+id], +id) as SongType;
    return (
        <div className={""}>
            <div className={styles.header}>
                <ArrowBack />
                <span>№{+id + 1}</span>
                <ShareBtn title={song.title} />
            </div>
            <div className={styles.songList__wrapper}>
                <div className={styles.songList__container}>
                    <SongView song={song} />
                </div>
            </div>
        </div>
    );
}
