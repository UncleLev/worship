"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { useAdminAuth } from "@/features/admin-auth";
import { SearchBar } from "@/features/search-songs";
import supabase from "@/shared/lib/supabase-browser";

import styles from "./admin-song-list.module.scss";

const PAGE_SIZE = 20;

type SongRow = {
    id: number;
    name: string;
    sort_order: number;
};

function LogoutIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
    );
}

export default function AdminSongList() {
    const { signOut } = useAdminAuth();
    const [songs, setSongs] = useState<SongRow[]>([]);
    const [search, setSearch] = useState("");
    const [from, setFrom] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef(search);
    const fromRef = useRef(from);
    const loadingRef = useRef(false);

    searchRef.current = search;
    fromRef.current = from;

    const fetchPage = useCallback(async (query: string, offset: number) => {
        loadingRef.current = true;
        setLoading(true);
        setFetchError(null);

        let req = supabase
            .from("songs")
            .select("id, name, sort_order")
            .order("sort_order", { ascending: true });

        const isNumber =
            query !== "" &&
            !Number.isNaN(Number(query)) &&
            Number.isInteger(Number(query));

        if (isNumber) {
            req = req.eq("sort_order", Number(query));
        } else if (query.trim()) {
            req = req.ilike("name", `%${query.trim()}%`);
        }

        if (!isNumber) {
            req = req.range(offset, offset + PAGE_SIZE - 1);
        }

        const { data, error } = await req;
        loadingRef.current = false;
        setLoading(false);

        if (error) {
            console.error("Supabase error:", error);
            setFetchError(error.message);
            return;
        }

        if (!data) return;

        setSongs((prev) =>
            offset === 0 ? (data as SongRow[]) : [...prev, ...(data as SongRow[])]
        );
        setHasMore(!isNumber && data.length === PAGE_SIZE);
        if (offset === 0) setFrom(PAGE_SIZE);
        else setFrom(offset + PAGE_SIZE);
    }, []);

    useEffect(() => {
        setSongs([]);
        setFrom(0);
        setHasMore(true);
        fetchPage(search, 0);
    }, [search, fetchPage]);

    useEffect(() => {
        const sentinel = sentinelRef.current;
        if (!sentinel) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !loadingRef.current) {
                    if (hasMore) {
                        fetchPage(searchRef.current, fromRef.current);
                    }
                }
            },
            { threshold: 0.1 }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, loading, fetchPage]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <span className={styles.header__title}>Адмін</span>
                <button className={styles.header__logout} onClick={signOut} aria-label="Вийти">
                    <LogoutIcon />
                </button>
            </header>
            <div className={styles.search}>
                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Номер / Назва.."
                />
            </div>
            <div className={styles.list}>
                {fetchError && (
                    <div className={styles.error}>{fetchError}</div>
                )}
                {songs.map((song) => (
                    <Link key={song.id} href={`/manage/edit/${song.id}`} className={styles.item}>
                        <span className={styles.item__order}>
                            {song.sort_order}.
                        </span>
                        <span className={styles.item__name}>{song.name}</span>
                    </Link>
                ))}
                {loading && (
                    <div className={styles.loading}>Завантаження...</div>
                )}
            </div>
            <div ref={sentinelRef} />
            <Link href="/manage/add" className={styles.fab} aria-label="Додати пісню">
                +
            </Link>
        </div>
    );
}
