import cs from "classnames";

import styles from "./chords-selector.module.scss";

type ChordSelectorType = {
    className?: string;
};

const ChordSelector = ({ className }: ChordSelectorType) => {
    return <div className={cs(styles.root, className)}>G#</div>;
};

export default ChordSelector;
