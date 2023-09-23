"use client";

import cs from "classnames";

import { usePathname } from "next/navigation";

import { ShareIcon } from "@/shared/icons";

import styles from "./share-btn.module.scss";

type ShareBtnType = {
    className?: string;
    title: string;
    text: string;
};

const ShareBtn = ({ className, title, text }: ShareBtnType) => {
    const path = usePathname();

    const handleClick = () => {
        if (navigator.share) {
            navigator.share({
                title,
                text: `${text.slice(0, 50)}...`,
                url: path,
            });
        } else {
            // TODO: add copy
        }
    };

    return (
        <button className={cs(styles.btn, className)} onClick={handleClick}>
            <ShareIcon />
        </button>
    );
};

export default ShareBtn;
