"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Modal from "react-modal";

import { parseSongRow } from "@/entities/song/lib/parser";
import { SongView } from "@/widgets/song-view";
import { DeleteSongFlow } from "@/features/delete-song";
import { scale } from "@/shared/lib/chord";
import supabase from "@/shared/lib/supabase-browser";

import { LeftArrowIcon } from "@/shared/ui/icons";

import styles from "./edit-song-view.module.scss";

Modal.setAppElement("body");

type Props = {
    id?: number;
};

function SaveIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
        </svg>
    );
}

function InfoIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
    );
}

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

export default function EditSongView({ id }: Props) {
    const isAdd = id === undefined;
    const router = useRouter();

    const [title, setTitle] = useState("");
    const [key, setKey] = useState("");
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(!isAdd);
    const [isSaving, setIsSaving] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [titleError, setTitleError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        if (isAdd) return;

        async function fetchSong() {
            setIsLoading(true);
            const { data, error } = await supabase
                .from("songs")
                .select("name, key, lyrics")
                .eq("id", id)
                .single();

            setIsLoading(false);

            if (error) {
                setFetchError(error.message);
                return;
            }

            if (!data) {
                setFetchError("Song not found");
                return;
            }

            setTitle(data.name);
            setKey(data.key ?? "");
            setContent(data.lyrics);
        }

        fetchSong();
    }, [id, isAdd]);

    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            if (isDirty) e.preventDefault();
        };
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    const previewSong = useMemo(() => {
        if (!content && !title) return null;
        try {
            return parseSongRow(
                { id: id ?? 0, name: title, key: key || null, lyrics: content, sort_order: id ?? 0 },
                0
            );
        } catch {
            return null;
        }
    }, [title, key, content, id]);

    const handleFieldChange = useCallback(
        <T,>(setter: React.Dispatch<React.SetStateAction<T>>) =>
            (value: T) => {
                setter(value);
                setIsDirty(true);
                setSuccessMessage(null);
            },
        []
    );

    const handleTitleChange = useCallback((value: string) => {
        setTitle(value);
        setTitleError(null);
        setIsDirty(true);
        setSuccessMessage(null);
    }, []);

    const handleSaveConfirm = useCallback(async () => {
        setIsSaving(true);
        setSaveError(null);

        const { error } = await supabase
            .from("songs")
            .update({ name: title, key: key || null, lyrics: content })
            .eq("id", id!);

        setIsSaving(false);
        setShowSaveDialog(false);

        if (error) {
            setSaveError(error.message);
        } else {
            setIsDirty(false);
            setSuccessMessage("Пісню збережено успішно");
        }
    }, [title, key, content, id]);

    const handleAddSave = useCallback(async () => {
        setIsSaving(true);
        setSaveError(null);
        setTitleError(null);

        // Check title uniqueness (case-insensitive)
        const { data: existing } = await supabase
            .from("songs")
            .select("id")
            .ilike("name", title.trim())
            .maybeSingle();

        if (existing) {
            setTitleError("Пісня з такою назвою вже існує");
            setIsSaving(false);
            return;
        }

        // Insert new song
        const { data: newSong, error: insertError } = await supabase
            .from("songs")
            .insert({ name: title.trim(), key: key || null, lyrics: content, sort_order: 0 })
            .select("id")
            .single();

        if (insertError || !newSong) {
            setSaveError(insertError?.message ?? "Помилка збереження");
            setIsSaving(false);
            return;
        }

        // Recalculate sort_order alphabetically
        const { data: allSongs, error: fetchError } = await supabase
            .from("songs")
            .select("id, name");

        if (!fetchError && allSongs) {
            const sorted = [...allSongs].sort((a, b) =>
                a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
            );
            await supabase
                .from("songs")
                .upsert(sorted.map((s, i) => ({ id: s.id, sort_order: i + 1 })), { onConflict: 'id' });
        }

        setIsDirty(false);
        router.push(`/manage/edit/${newSong.id}`);
    }, [title, key, content, router]);

    if (isLoading) {
        return <div className={styles.loading}>Завантаження...</div>;
    }

    if (fetchError) {
        return <div className={styles.error}>{fetchError}</div>;
    }

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <Link href="/manage" className={styles.header__back} aria-label="Назад">
                    <LeftArrowIcon />
                </Link>
                <span className={styles.header__title}>
                    {isAdd ? "Додавання" : "Редагування"}
                </span>
                <button
                    className={styles.header__save}
                    onClick={isAdd ? handleAddSave : () => setShowSaveDialog(true)}
                    disabled={isSaving || !title.trim() || !content.trim()}
                    aria-label={isSaving ? "Збереження..." : "Зберегти"}
                >
                    <SaveIcon />
                </button>
            </header>

            {successMessage && (
                <div className={styles.success}>{successMessage}</div>
            )}
            {saveError && (
                <div className={styles.error}>{saveError}</div>
            )}

            <div className={styles.mobileToggle}>
                <button
                    className={`${styles.mobileToggle__btn} ${mobileTab === "edit" ? styles["mobileToggle__btn--active"] : ""}`}
                    onClick={() => setMobileTab("edit")}
                >
                    Редактор
                </button>
                <button
                    className={`${styles.mobileToggle__btn} ${mobileTab === "preview" ? styles["mobileToggle__btn--active"] : ""}`}
                    onClick={() => setMobileTab("preview")}
                >
                    Перегляд
                </button>
            </div>

            <div className={styles.body}>
                <div className={`${styles.editor} ${mobileTab === "preview" ? styles["editor--hidden"] : ""}`}>
                    <div className={styles.field}>
                        <label className={styles.field__label} htmlFor="edit-title">
                            Назва
                        </label>
                        <input
                            id="edit-title"
                            className={styles.field__input}
                            type="text"
                            value={title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                        />
                        {titleError && (
                            <span className={styles.field__error}>{titleError}</span>
                        )}
                    </div>

                    <div className={styles.field}>
                        <label className={styles.field__label} htmlFor="edit-key">
                            Тональність
                        </label>
                        <select
                            id="edit-key"
                            className={styles.field__select}
                            value={key}
                            onChange={(e) => handleFieldChange(setKey)(e.target.value)}
                        >
                            <option value="">—</option>
                            {scale.map((k) => (
                                <option key={k} value={k}>
                                    {k}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={`${styles.field} ${styles["field--grow"]}`}>
                        <div className={styles.field__labelRow}>
                            <label className={styles.field__label} htmlFor="edit-content">
                                Зміст
                            </label>
                            <button
                                className={styles.field__infoBtn}
                                onClick={() => setShowInfoModal(true)}
                                aria-label="Довідка по формату"
                            >
                                <InfoIcon />
                            </button>
                        </div>
                        <textarea
                            id="edit-content"
                            className={styles.field__textarea}
                            value={content}
                            onChange={(e) => handleFieldChange(setContent)(e.target.value)}
                        />
                    </div>
                </div>

                <div className={`${styles.preview} ${mobileTab === "edit" ? styles["preview--hidden"] : ""}`}>
                    {previewSong ? (
                        <SongView song={previewSong} />
                    ) : (
                        <div className={styles.preview__empty}>Порожній перегляд</div>
                    )}
                </div>
            </div>

            {!isAdd && (
                <div className={styles.dangerZone}>
                    <DeleteSongFlow songId={id!} />
                </div>
            )}

            {/* Save confirmation dialog (edit mode only) */}
            {!isAdd && (
                <Modal
                    isOpen={showSaveDialog}
                    onRequestClose={() => setShowSaveDialog(false)}
                    style={modalStyle}
                    contentLabel="Підтвердити збереження"
                >
                    <div className={styles.dialog}>
                        <p className={styles.dialog__text}>Зберегти зміни?</p>
                        <div className={styles.dialog__actions}>
                            <button
                                className={styles.dialog__cancel}
                                onClick={() => setShowSaveDialog(false)}
                                disabled={isSaving}
                            >
                                Скасувати
                            </button>
                            <button
                                className={styles.dialog__confirm}
                                onClick={handleSaveConfirm}
                                disabled={isSaving}
                            >
                                {isSaving ? "Збереження..." : "Зберегти"}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {/* Format info modal */}
            <Modal
                isOpen={showInfoModal}
                onRequestClose={() => setShowInfoModal(false)}
                style={modalStyle}
                contentLabel="Довідка по формату"
            >
                <div className={styles.infoModal}>
                    <h3 className={styles.infoModal__title}>Формат змісту</h3>
                    <ul className={styles.infoModal__list}>
                        <li>
                            <code>@Назва секції</code> — заголовок секції (напр. <code>@Куплет</code>, <code>@Приспів</code>, <code>@Bridge</code>)
                        </li>
                    </ul>
                    <button
                        className={styles.infoModal__close}
                        onClick={() => setShowInfoModal(false)}
                    >
                        Закрити
                    </button>
                </div>
            </Modal>
        </div>
    );
}
