"use client";

import cs from "classnames";

import { ShareIcon } from "@/shared/icons";

import styles from "./share-btn.module.scss";

type ShareBtnType = {
    className?: string;
    title: string;
};

const ShareBtn = ({ className, title }: ShareBtnType) => {
    const handleClick = () => {
        if (navigator.share) {
            navigator.share({
                title,
                text: title,
                url: document.location.href,
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
