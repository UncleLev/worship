import { Metadata } from "next/types";

import { ArrowBack, ShareBtn, SongView } from "@/widgets/song-view";
import SongNotFound from "./_song-not-found";

import styles from "./page.module.scss";

import { SongType } from "@/entities/song/model/types";

import { getFirstTextBlock } from "@/shared/lib/text";

import { fetchSongs, fetchSongById } from "@/entities/song/api/supabase";
import { parseSongRow } from "@/entities/song/lib/parser";

export async function generateStaticParams() {
    const rows = await fetchSongs();
    return rows.map((row) => ({
        id: String(row.id),
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const row = await fetchSongById(+id);
    if (!row) return {};
    const song = parseSongRow(row, row.sort_order);

    return {
        title: song.title,
        description: getFirstTextBlock(song),
    };
}

export default async function Song({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const row = await fetchSongById(+id);

    if (!row) {
        return (
            <div className={styles.songList__wrapper}>
                <div className={styles.songList__container}>
                    <SongNotFound />
                </div>
            </div>
        );
    }

    const song = parseSongRow(row, row.sort_order) as SongType;
    return (
        <div className={""}>
            <div className={styles.header}>
                <ArrowBack />
                <span>№{row.sort_order}</span>
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
