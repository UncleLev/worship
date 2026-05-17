import Link from 'next/link';
import styles from './admin-song-number-link.module.scss';

type Props = {
  sortOrder: number;
  songId: number;
};

export default function AdminSongNumberLink({ sortOrder, songId }: Props) {
  return (
    <Link href={`/manage/edit/${songId}`} className={styles.link}>
      №{sortOrder}
    </Link>
  );
}
