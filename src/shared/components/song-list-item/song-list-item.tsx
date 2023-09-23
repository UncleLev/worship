import cs from "classnames";

import Link from "next/link";

import { RightArrowIcon } from "@/shared/icons";

import styles from "./song-list-item.module.scss";

type SongListItemType = {
    className?: string;
    name: string;
    index: number;
};

const SongListItem = ({ className, index, name }: SongListItemType) => {
    return (
        <Link className={cs(styles.item, className)} href={`/song/${index}`}>
            <span className={styles.item__name}>
                {`${index + 1}. ${name}`}
            </span>
            <RightArrowIcon />
        </Link>
    );
};

export default SongListItem;
