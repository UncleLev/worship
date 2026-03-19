"use client";

import { useCallback, useEffect, useState } from "react";

import { SearchBar } from "@/features/search-songs";
import { Filter, FilterEnum } from "@/features/filter-songs";
import { SongListItem } from "@/entities/song";

import { ResetIcon } from "@/shared/ui/icons";

import supabase from "@/shared/lib/supabase-browser";

import styles from "./song-list.module.scss";

type SongEntry = { name: string; index: number };

const randomNumbArray = ({
    length,
    max,
    min = 0,
}: {
    length: number;
    max: number;
    min: number;
}) => {
    const result: number[] = [];
    while (result.length !== length) {
        const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
        if (!result.includes(randNum)) result.push(randNum);
    }
    return result;
};

const findSongs = (
    songs: SongEntry[],
    input: string,
    filter: FilterEnum | null
): SongEntry[] => {
    if (filter === FilterEnum.random) {
        const randArr = randomNumbArray({
            length: 3,
            min: 0,
            max: songs.length - 1,
        });
        return songs.filter((_, i) => randArr.includes(i));
    }

    if (!input) return songs;

    if (!Number.isNaN(+input) && Number.isInteger(+input)) {
        const song = songs.find((s) => s.index + 1 === +input);
        return song ? [song] : [];
    }

    if (input.trim()) {
        const rx = new RegExp(input.trim().toLowerCase());
        return songs.filter((el) => rx.test(el.name.toLowerCase()));
    }
    return [];
};

export default function SongList() {
    const title = "Worship";
    const [songs, setSongs] = useState<SongEntry[]>([]);
    const [search, setSearch] = useState("");
    const [filer, setFiler] = useState<FilterEnum | null>(null);
    const [data, setData] = useState<SongEntry[]>([]);

    useEffect(() => {
        supabase
            .from("songs")
            .select("name, sort_order")
            .order("sort_order", { ascending: true })
            .order("name", { ascending: true })
            .then(({ data: rows }) => {
                if (!rows) return;
                const entries = rows.map((r) => ({
                    name: r.name as string,
                    index: (r.sort_order as number) - 1,
                }));
                setSongs(entries);
                setData(entries);
            });
    }, []);

    const updateData = useCallback(
        () => setData(findSongs(songs, search, filer)),
        [songs, filer, search]
    );

    const handleFilter = (type: FilterEnum) => {
        setSearch("");

        if (filer === type) {
            setFiler(null);
            return;
        }
        setFiler(type);
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setFiler(null);
    };

    const handleResetData = () => {
        updateData();
    };

    useEffect(() => {
        updateData();
    }, [updateData]);

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <h2 className={styles.header__title}>{title}</h2>
            </div>
            <div className={styles.page__content}>
                <div className={styles.page__search}>
                    <SearchBar
                        value={search}
                        onChange={handleSearch}
                        placeholder="Номер / Назва.."
                    />
                    <Filter activeFilter={filer} onChange={handleFilter} />
                </div>
                <div className={styles.page__list}>
                    {data.map((song, i) => (
                        <SongListItem
                            key={i}
                            name={song.name}
                            index={song.index}
                        />
                    ))}
                    {filer === FilterEnum.random && (
                        <button
                            className={styles.resetBtn}
                            onClick={handleResetData}
                        >
                            <ResetIcon />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
