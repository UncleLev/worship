'use client';

import { useRouter } from 'next/navigation';

import { SearchBar, useSearchSongs } from '@/features/search-songs';
import { Filter, FilterEnum } from '@/features/filter-songs';
import { SongListItem, useSongList } from '@/entities/song';

import { ResetIcon } from '@/shared/ui/icons';
import { useSecretPattern } from '@/shared/lib/use-secret-pattern';
import { useScrollRestore } from '@/shared/lib/use-scroll-restore';

import styles from './song-list.module.scss';

export default function SongList() {
  const router = useRouter();
  const { songs } = useSongList();
  const { data, search, filter, handleSearch, handleFilter, resetData } =
    useSearchSongs(songs);

  const { onPointerDown, onPointerUp } = useSecretPattern({
    pattern: ['-', '.', '.', '.', '-'],
    onMatch: () => router.push('/manage'),
  });

  const { listRef, saveScrollId } = useScrollRestore({ data });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2
          className={styles.header__title}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          Worship
        </h2>
      </div>
      <div className={styles.page__content}>
        <div className={styles.page__search}>
          <SearchBar
            value={search}
            onChange={handleSearch}
            placeholder="Номер / Назва.."
          />
          <Filter activeFilter={filter} onChange={handleFilter} />
        </div>
        <div ref={listRef} className={styles.page__list}>
          {data.map((song) => (
            <div
              key={song.id}
              data-song-id={song.id}
              onClick={() => saveScrollId(song.id)}
            >
              <SongListItem name={song.name} id={song.id} num={song.num} />
            </div>
          ))}
          {filter === FilterEnum.random && (
            <button className={styles.resetBtn} onClick={resetData}>
              <ResetIcon />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
