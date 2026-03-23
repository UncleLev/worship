import { useCallback, useEffect, useState } from "react";

import { FilterEnum } from "@/features/filter-songs";
import type { SongEntry } from "@/entities/song";

const randomNumbArray = ({
  length,
  max,
  min = 0,
}: {
  length: number;
  max: number;
  min: number;
}) => {
  const result: number[] = [];
  while (result.length !== length) {
    const randNum = Math.floor(Math.random() * (max - min + 1)) + min;
    if (!result.includes(randNum)) result.push(randNum);
  }
  return result;
};

const findSongs = (
  songs: SongEntry[],
  input: string,
  filter: FilterEnum | null,
): SongEntry[] => {
  if (filter === FilterEnum.random) {
    const randArr = randomNumbArray({
      length: 3,
      min: 0,
      max: songs.length - 1,
    });
    return songs.filter((_, i) => randArr.includes(i));
  }

  if (!input) return songs;

  if (!Number.isNaN(+input) && Number.isInteger(+input)) {
    const song = songs.find((s) => s.num === +input);
    return song ? [song] : [];
  }

  if (input.trim()) {
    const rx = new RegExp(input.trim().toLowerCase());
    return songs.filter((el) => rx.test(el.name.toLowerCase()));
  }
  return [];
};

export function useSearchSongs(songs: SongEntry[]) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterEnum | null>(null);
  const [data, setData] = useState<SongEntry[]>([]);

  const updateData = useCallback(
    () => setData(findSongs(songs, search, filter)),
    [songs, filter, search],
  );

  const handleFilter = (type: FilterEnum) => {
    setSearch("");
    if (filter === type) {
      setFilter(null);
      return;
    }
    setFilter(type);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setFilter(null);
  };

  const resetData = () => {
    updateData();
  };

  useEffect(() => {
    updateData();
  }, [updateData]);

  return { data, search, filter, handleSearch, handleFilter, resetData };
}
