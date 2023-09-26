"use client";
import cs from "classnames";
import { useState } from "react";

import Modal from "react-modal";

import { scale } from "@/utils/chord";

import styles from "./tonality-select.module.scss";

Modal.setAppElement("body");

type TonalitySelectType = {
    className?: string;
    originKey: string;
    transposeKey: string;
    onKeyChange: (key: string) => void;
};

const TonalitySelect = ({
    className,
    originKey,
    transposeKey,
    onKeyChange,
}: TonalitySelectType) => {
    const [open, setOpen] = useState(false);

    const hanldeClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const hanldeChangeTone = (key: string) => () => {
        onKeyChange(key);
        setOpen(false);
    };

    return (
        <>
            <button
                className={cs(styles.button, className)}
                onClick={handleOpen}
            >
                {transposeKey}
            </button>
            <Modal
                isOpen={open}
                onRequestClose={hanldeClose}
                style={{
                    content: {
                        top: "50%",
                        left: "50%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        minWidth: "300px",
                    },
                    overlay: {
                        position: "fixed",
                        backgroundColor: "rgb(65 65 65 / 75%)",
                    },
                }}
                contentLabel="Tonality select"
            >
                <div className={styles.list}>
                    {scale.map((el) => (
                        <div
                            className={cs(
                                styles.list__item,
                                el === transposeKey &&
                                    styles["list__item--active"]
                            )}
                            key={el}
                            onClick={hanldeChangeTone(el)}
                        >
                            {el} {el === originKey && "origin"}
                        </div>
                    ))}
                </div>
            </Modal>
        </>
    );
};

export default TonalitySelect;
