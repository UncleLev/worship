'use client';

import { useState } from 'react';
import Link from 'next/link';

import styles from './_song-not-found.module.scss';

const JOKES = [
  'Ой, ну ми вирішили що цю пісню вже не співають, сорі',
  'Адмін не сильно любив цю пісню',
  'Хммм, хтось вирвав сторінку з цією піснею, пошукай іншу',
];

export default function SongNotFound() {
  const [joke] = useState(
    () => JOKES[Math.floor(Math.random() * JOKES.length)],
  );

  return (
    <div className={styles.container}>
      <p className={styles.message}>{joke}</p>
      <Link href="/" className={styles.backBtn}>
        До списку пісень
      </Link>
    </div>
  );
}
