'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import SongNotFound from './song/[id]/_song-not-found';
import supabase from '@/shared/lib/supabase-browser';

import styles from './not-found.module.scss';

const SONG_PATH = /^\/(?:song|manage\/edit)\/(\d+)\/?$/;

type Reason = 'checking' | 'not-published' | 'no-song' | 'no-page';

// With static export the host serves this page for every missing address, so
// the reason is worked out here: a song page exists only for songs present at
// the last publish.
export default function NotFound() {
  const [reason, setReason] = useState<Reason>('checking');

  useEffect(() => {
    const match = SONG_PATH.exec(window.location.pathname);
    if (!match) {
      setReason('no-page');
      return;
    }

    supabase
      .from('songs')
      .select('id')
      .eq('id', Number(match[1]))
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) setReason('no-page');
        else setReason(data ? 'not-published' : 'no-song');
      });
  }, []);

  if (reason === 'checking') return null;

  return (
    <div className={styles.container}>
      {reason === 'no-song' && <SongNotFound />}
      {reason === 'not-published' && (
        <>
          <h2 className={styles.title}>Сторінка ще не готова</h2>
          <p className={styles.message}>
            Якщо пісню щойно додали, вона зʼявиться після публікації — зазвичай
            за 5 хвилин.
          </p>
        </>
      )}
      {reason === 'no-page' && (
        <h2 className={styles.title}>Такої сторінки немає</h2>
      )}
      {reason !== 'no-song' && (
        <Link href="/" className={styles.backBtn}>
          До списку пісень
        </Link>
      )}
    </div>
  );
}
