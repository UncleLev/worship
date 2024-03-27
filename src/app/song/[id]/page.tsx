import { Metadata } from "next/types";

import { SongType } from "@/shared/types";

import { getFirstTextBlock } from "@/shared/lib/text";

import data from "@/data/songs.json";
import { SongPage } from "@/pages/song/ui/song.component";

export async function generateStaticParams() {
    return data.map(({ index }) => ({
        id: String(index),
    }));
}

export async function generateMetadata({
    params,
}: {
    params: { id: string };
}): Promise<Metadata> {
    const id = params.id;
    const song = data[+id] as SongType;

    return {
        title: song.title,
        description: getFirstTextBlock(song),
    };
}

export default function Page({ params }: { params: { id: string } }) {
    const song = data[+params?.id] as SongType;
    return <SongPage id={params?.id} song={song} />;
}
