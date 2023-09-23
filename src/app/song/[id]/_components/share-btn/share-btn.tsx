"use client";

import cs from "classnames";

import { usePathname } from "next/navigation";

import { ShareIcon } from "@/shared/icons";

import styles from "./share-btn.module.scss";

type ShareBtnType = {
    className?: string;
    title: string;
};

const ShareBtn = ({ className, title }: ShareBtnType) => {
    const path = usePathname();

    const handleClick = () => {
        if (navigator.share) {
            navigator.share({
                title,
                text: title,
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
