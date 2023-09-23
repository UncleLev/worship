"use client";
import { LeftArrowIcon } from "@/shared/icons";
import { useRouter } from "next/navigation";

type ArrowBackType = {
    className?: string;
};

const ArrowBack = ({ className }: ArrowBackType) => {
    const navigation = useRouter();

    const handleGoBack = () => {
        if (window.history.length === 1) {
            navigation.push("/");
        } else {
            navigation.back();
        }
    };

    return (
        <div className={className} onClick={handleGoBack}>
            <LeftArrowIcon />
        </div>
    );
};

export default ArrowBack;
