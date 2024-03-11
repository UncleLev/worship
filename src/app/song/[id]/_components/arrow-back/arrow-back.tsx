"use client";
import cs from "classnames";
import { useRouter } from "next/navigation";
import { LeftArrowIcon } from "@/shared/icons";

import styles from "./arrow-back.module.scss";

type ArrowBackType = {
    className?: string;
};

const ArrowBack = ({ className }: ArrowBackType) => {
    const navigation = useRouter();

    const handleGoBack = () => {
        navigation.push("/");
    };

    return (
        <div className={cs(styles.root, className)} onClick={handleGoBack}>
            <LeftArrowIcon />
        </div>
    );
};

export default ArrowBack;
