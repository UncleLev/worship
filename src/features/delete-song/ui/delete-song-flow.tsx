'use client';

import { useCallback, useState } from 'react';
import Modal from 'react-modal';
import { useRouter } from 'next/navigation';

import supabase from '@/shared/lib/supabase-browser';
import { reorderSongsAlphabetically } from '@/entities/song/api/reorder-songs';

import styles from './delete-song-flow.module.scss';

Modal.setAppElement('body');

const modalStyle = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '300px',
    maxWidth: '480px',
    width: '90vw',
  },
  overlay: {
    position: 'fixed' as const,
    backgroundColor: 'rgb(65 65 65 / 75%)',
    zIndex: 1000,
  },
};

type Props = {
  songId: number;
  redirectTo?: string;
};

export default function DeleteSongFlow({
  songId,
  redirectTo = '/manage',
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState<null | 'first' | 'second'>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = useCallback(async () => {
    setIsDeleting(true);
    setDeleteError(null);

    const { error } = await supabase.from('songs').delete().eq('id', songId);

    if (error) {
      setDeleteError(error.message);
      setIsDeleting(false);
      return;
    }

    await reorderSongsAlphabetically();
    router.push(redirectTo);
  }, [songId, redirectTo, router]);

  return (
    <>
      <button className={styles.deleteBtn} onClick={() => setStep('first')}>
        Видалити
      </button>

      <Modal
        isOpen={step === 'first'}
        onRequestClose={() => setStep(null)}
        style={modalStyle}
        contentLabel="Перше підтвердження видалення"
      >
        <div className={styles.dialog}>
          <p className={styles.dialog__text}>Ти впевнений?</p>
          <div className={styles.dialog__actions}>
            <button
              className={styles.dialog__cancel}
              onClick={() => setStep(null)}
            >
              Скасувати
            </button>
            <button
              className={styles.dialog__confirm}
              onClick={() => setStep('second')}
            >
              Так
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={step === 'second'}
        onRequestClose={() => setStep(null)}
        style={modalStyle}
        contentLabel="Друге підтвердження видалення"
      >
        <div className={styles.dialog}>
          <p className={styles.dialog__text}>
            Ти точно хочеш цього, потім прийдеться назад додавати вручну ...
          </p>
          {deleteError && <p className={styles.dialog__error}>{deleteError}</p>}
          <div className={styles.dialog__actions}>
            <button
              className={styles.dialog__cancel}
              onClick={() => setStep(null)}
              disabled={isDeleting}
            >
              Скасувати
            </button>
            <button
              className={styles.dialog__confirmDelete}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Видалення...' : 'Так, видалити'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
