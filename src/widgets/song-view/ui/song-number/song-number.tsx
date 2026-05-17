'use client';

import { useRouter } from 'next/navigation';
import { useSecretPattern } from '@/shared/lib/use-secret-pattern';

import styles from './song-number.module.scss';

type Props = {
  sortOrder: number;
  songId: number;
};

export default function SongNumber({ sortOrder, songId }: Props) {
  const router = useRouter();

  const { onPointerDown, onPointerUp } = useSecretPattern({
    pattern: ['-', '.', '.', '.', '-'],
    onMatch: () => router.push(`/manage/edit/${songId}`),
  });

  return (
    <span
      className={styles.number}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      №{sortOrder}
    </span>
  );
}
