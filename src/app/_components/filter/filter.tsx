import cs from "classnames";

import { RandIcon } from "@/shared/icons";

import { FilterEnum } from "@/shared/types";

import styles from "./filter.module.scss";

type FilterType = {
    className?: string;
    onChange: (type: FilterEnum) => void;
    activeFilter: FilterEnum | null;
};

const Filter = ({ className, onChange, activeFilter }: FilterType) => {
    return (
        <div className={cs(styles.container, className)}>
            <button
                className={cs(
                    styles.btn,
                    activeFilter === FilterEnum.random &&
                        styles["btn--selected"]
                )}
                onClick={() => onChange(FilterEnum.random)}
            >
                <RandIcon />
            </button>
        </div>
    );
};

export default Filter;
