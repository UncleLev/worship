"use client";

import cs from "classnames";
import throttle from "lodash/throttle";

import { SearchIcon } from "@/shared/ui/icons";

import styles from "./search-bar.module.scss";

type SearchBarType = {
    className?: string;
    placeholder?: string;
    onChange: (value: string) => void;
    value: string;
};

export const SearchBar = ({
    className,
    value,
    placeholder,
    onChange,
}: SearchBarType) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        onChange(value);
    };

    const throttledOnChange = throttle(handleChange, 500);

    return (
        <label className={cs(styles.search, className)}>
            <SearchIcon />
            <input
                onChange={throttledOnChange}
                className={styles.search__input}
                type="search"
                value={value}
                placeholder={placeholder ?? "Шукати..."}
            />
        </label>
    );
};
