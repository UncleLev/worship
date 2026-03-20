import { fetchSongs } from "@/entities/song/api/supabase";
import { AdminAuthGate } from "@/features/admin-auth";
import { EditSongView } from "@/widgets/edit-song-view";

export async function generateStaticParams() {
    const songs = await fetchSongs();
    return songs.map((song) => ({ id: String(song.id) }));
}

export default async function EditSongPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return (
        <AdminAuthGate>
            <EditSongView id={+id} />
        </AdminAuthGate>
    );
}
