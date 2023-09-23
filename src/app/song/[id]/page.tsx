"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { ChordSelector } from "@/shared/components";
import { LeftArrowIcon } from "@/shared/icons";

import styles from "./page.module.scss";

import data from "@/data/songs.json";

export default function Song() {
    const { id } = useParams();
    const navigation = useRouter();

    const handleGoBack = () => {
        if (window.history.length === 1) {
            navigation.push("/");
        } else {
            navigation.back();
        }
    };

    const song = data[+id];

    useEffect(() => {
        document.title = song.title;
    }, [song]);

    return (
        <div className={""}>
            <div className={styles.header}>
                <div onClick={handleGoBack}>
                    <LeftArrowIcon />
                </div>
                <span>№{+id + 1}</span>
                <ChordSelector />
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
