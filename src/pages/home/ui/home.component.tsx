"use client";
import { useCallback, useEffect, useState } from "react";

import { ResetIcon } from "@/shared/ui/icons";
import { FilterEnum, SongType } from "@/shared/types";
import songs from "@/data/songs.json";

import styles from "./page.module.scss";
import { Filter } from "./filter/filter";
import { SearchBar } from "./search-bar/search-bar";
import { SongListItem } from "./song-list-item/song-list-item";

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

const findSongs = (input: string, filter: FilterEnum | null): SongType[] => {
    if (filter === FilterEnum.random) {
        const randArr = randomNumbArray({
            length: 3,
            min: 0,
            max: songs.length - 1,
        });

        return songs.filter((song) =>
            randArr.includes(song.index)
        ) as SongType[];
    }

    if (!input) return songs as SongType[];

    if (!Number.isNaN(+input) && Number.isInteger(+input)) {
        const song = songs[+input - 1];
        const res = song ? [song] : ([] as SongType[]);
        return res as SongType[];
    }

    if (input.trim()) {
        const rx = new RegExp(input.trim().toLowerCase());
        return songs.filter((el) =>
            rx.test(el.title.toLowerCase())
        ) as SongType[];
    }
    return [];
};

export function Home() {
    const title = "Worship";
    const [search, setSearch] = useState("");
    const [filer, setFiler] = useState<FilterEnum | null>(null);
    const [data, setData] = useState<SongType[]>(findSongs("", null));

    const updateData = useCallback(
        () => setData(findSongs(search, filer)),
        [filer, search]
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
                            name={song.title}
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
