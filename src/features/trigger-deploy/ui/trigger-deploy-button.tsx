"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Modal from "react-modal";

import supabase from "@/shared/lib/supabase-browser";

import styles from "./trigger-deploy-button.module.scss";

const DEPLOY_DURATION_MS = 5 * 60 * 1000;
const LS_KEY = "deploy_active_until";

Modal.setAppElement("body");

const modalStyle = {
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        minWidth: "300px",
        maxWidth: "480px",
        width: "90vw",
    },
    overlay: {
        position: "fixed" as const,
        backgroundColor: "rgb(65 65 65 / 75%)",
        zIndex: 1000,
    },
};

function DeployIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
            <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
            <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
            <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
        </svg>
    );
}

function HourglassIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 22h14" />
            <path d="M5 2h14" />
            <path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22" />
            <path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2" />
        </svg>
    );
}

function formatCountdown(ms: number): string {
    const totalSec = Math.max(0, Math.ceil(ms / 1000));
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${String(sec).padStart(2, "0")}`;
}

export default function TriggerDeployButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [msLeft, setMsLeft] = useState(0);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const startCountdown = useCallback((until: number) => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setMsLeft(until - Date.now());
        intervalRef.current = setInterval(() => {
            const remaining = until - Date.now();
            if (remaining <= 0) {
                clearInterval(intervalRef.current!);
                intervalRef.current = null;
                setMsLeft(0);
            } else {
                setMsLeft(remaining);
            }
        }, 1000);
    }, []);

    useEffect(() => {
        const until = Number(localStorage.getItem(LS_KEY) ?? 0);
        if (until > Date.now()) {
            setIsDeploying(true);
            startCountdown(until);
            timerRef.current = setTimeout(() => {
                setIsDeploying(false);
                localStorage.removeItem(LS_KEY);
            }, until - Date.now());
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [startCountdown]);

    const handleConfirm = useCallback(async () => {
        setIsOpen(false);
        setIsDeploying(true);
        setError(null);

        const until = Date.now() + DEPLOY_DURATION_MS;
        localStorage.setItem(LS_KEY, String(until));
        startCountdown(until);

        timerRef.current = setTimeout(() => {
            setIsDeploying(false);
            localStorage.removeItem(LS_KEY);
        }, DEPLOY_DURATION_MS);

        const { error: fnError } = await supabase.functions.invoke("trigger-deploy");

        if (fnError) {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (intervalRef.current) clearInterval(intervalRef.current);
            localStorage.removeItem(LS_KEY);
            setIsDeploying(false);
            setMsLeft(0);
            setError(fnError.message ?? "Не вдалося запустити деплой");
            setIsOpen(true);
        }
    }, [startCountdown]);

    const handleButtonClick = useCallback(() => {
        setError(null);
        setIsOpen(true);
    }, []);

    return (
        <>
            <button
                className={`${styles.deployBtn} ${isDeploying ? styles.deployBtn_active : ""}`}
                onClick={handleButtonClick}
                aria-label="Розгорнути"
            >
                {isDeploying ? <HourglassIcon /> : <DeployIcon />}
            </button>

            <Modal
                isOpen={isOpen}
                onRequestClose={() => setIsOpen(false)}
                style={modalStyle}
                contentLabel={isDeploying ? "Статус деплою" : "Підтвердження деплою"}
            >
                {isDeploying ? (
                    <div className={styles.dialog}>
                        <p className={styles.dialog__title}>Деплой виконується...</p>
                        <p className={styles.dialog__warning}>
                            Зміни публікуються. Зачекай завершення перед наступними правками.
                        </p>
                        <p className={styles.dialog__countdown}>
                            Залишилось приблизно <strong>{formatCountdown(msLeft)}</strong>
                        </p>
                        <div className={styles.dialog__actions}>
                            <button
                                className={styles.dialog__cancel}
                                onClick={() => setIsOpen(false)}
                            >
                                Закрити
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.dialog}>
                        <p className={styles.dialog__title}>Розгорнути зміни?</p>
                        <p className={styles.dialog__warning}>
                            Переконайся, що всі правки завершені — деплой опублікує поточний стан даних.
                        </p>
                        <p className={styles.dialog__info}>
                            Деплой займає приблизно <strong>5 хвилин</strong>.
                        </p>
                        {error && (
                            <p className={styles.dialog__error}>{error}</p>
                        )}
                        <div className={styles.dialog__actions}>
                            <button
                                className={styles.dialog__cancel}
                                onClick={() => setIsOpen(false)}
                            >
                                Скасувати
                            </button>
                            <button
                                className={styles.dialog__confirm}
                                onClick={handleConfirm}
                            >
                                Підтвердити
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}
