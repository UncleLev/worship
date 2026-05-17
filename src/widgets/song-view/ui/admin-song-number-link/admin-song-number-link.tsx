'use client';

import Link from 'next/link';
import { useAdminAuth } from '@/features/admin-auth';

import styles from './admin-song-number-link.module.scss';

type Props = {
  sortOrder: number;
  songId: number;
};

export default function AdminSongNumberLink({ sortOrder, songId }: Props) {
  const { state } = useAdminAuth();

  if (state === 'authenticated') {
    return (
      <Link href={`/manage/edit/${songId}`} className={styles.link}>
        №{sortOrder}
      </Link>
    );
  }

  return <span className={styles.number}>№{sortOrder}</span>;
}
