import cs from "classnames";

import Link from "next/link";

import { RightArrowIcon } from "@/shared/ui/icons";

import styles from "./song-list-item.module.scss";

type SongListItemType = {
    className?: string;
    name: string;
    id: number;
    num: number;
};

const SongListItem = ({ className, id, name, num }: SongListItemType) => {
    return (
        <Link className={cs(styles.item, className)} href={`/song/${id}`}>
            <span className={styles.item__name}>
                {`${num}. ${name}`}
            </span>
            <RightArrowIcon />
        </Link>
    );
};

export default SongListItem;
