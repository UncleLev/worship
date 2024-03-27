import cs from "classnames";
import styles from "./filter.module.scss";

import { RandIcon } from "@/shared/ui/icons";
import { FilterEnum } from "@/shared/types";

type FilterType = {
    className?: string;
    onChange: (type: FilterEnum) => void;
    activeFilter: FilterEnum | null;
};

export const Filter = ({ className, onChange, activeFilter }: FilterType) => {
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
