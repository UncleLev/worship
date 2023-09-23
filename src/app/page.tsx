"use client";

import { useMemo, useState } from "react";

import { SearchBar, SongListItem } from "@/shared/components";

import styles from "./page.module.scss";

import songs from "@/data/songs.json";

const findSongs = (input: string) => {
    if (!input) return songs;

    if (!Number.isNaN(+input) && Number.isInteger(+input)) {
        const song = songs[+input - 1];
        return song ? [song] : [];
    }

    if (input) {
        const rx = new RegExp(input.toLowerCase());
        return songs.filter((el) => rx.test(el.title.toLowerCase()));
    }
    return [];
};

export default function Home() {
    const title = "Пісні 1.0";
    const [search, setSearch] = useState("");

    const data = useMemo(() => findSongs(search), [search]);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h2 className={styles.header__title}>{title}</h2>
            </div>
            <div className={styles.page__content}>
                <div className={styles.page__search}>
                    <SearchBar
                        onChange={setSearch}
                        placeholder="Номер / Назва.."
                    />
                </div>
                <div className={styles.page__list}>
                    {data.map((song, i) => (
                        <SongListItem
                            key={i}
                            name={song.title}
                            index={song.index}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
