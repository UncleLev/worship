import { Metadata } from "next/types";

import { SongType } from "@/shared/types";

import { getFirstTextBlock } from "@/shared/lib/text";

import data from "@/data/songs.json";
import { SongPage } from "@/pages/song";
import { api } from "@/shared/lib/api";
import { cache } from "react";

export async function generateStaticParams() {
    return data.map(({ index }) => ({
        id: String(index),
    }));
    // const res = await api.get("/api/songs");
    // const songs: SongType[] = res?.data?.songs || [];
    // return songs.map(({ id }) => ({ id: String(id) }));
}

// export const getStaticProps = async (context) => {
//     console.log(" ----------------------------------");
//     console.log("getStaticProps ~ context:", context);
//     console.log(" ----------------------------------");
//     // const res = await fetch("https://api.github.com/repos/vercel/next.js");
//     // const repo = await res.json();
//     // return { props: { repo } };
// };

// export async function generateMetadata({
//     params,
// }: {
//     params: { id: string };
// }): Promise<Metadata> {
//     const id = params.id;
//     const song = data[+id] as SongType;

//     return {
//         title: song.title,
//         description: getFirstTextBlock(song),
//     };
// }

// export const getServerSideProps = async () => {
//     // Fetch data from external API
//     // const res = await api;
//     // const repo: Repo = await res.json();
//     // Pass data to the page via props
//     const song = {};
//     return { props: { song } };
// };

export const getSong = cache(async (id: string) => {
    console.log(" -----------------");
    console.log("getSong ~ id:", id);
    console.log(" -----------------");
    const res = await api.get(`/api/songs`);
    const song = res.data.songs[id];
    console.log(" -------------------");
    console.log("getSong ~ res:", res);
    console.log(" -------------------");
    return song;
});

export default async function Page({ params }: { params: { id: string } }) {
    console.log(" ----------------------");
    console.log("Page ~ params:", params);
    console.log(" ----------------------");
    // const song = data[+params?.id] as SongType;

    // return "SOng Fe3";
    const song = await getSong(params.id);
    console.log(" ------------------");
    console.log("Page ~ song:", song);
    console.log(" ------------------");
    return <SongPage id={params.id} song={song} />;
}
