"use client";

import { AdminAuthGate } from "@/features/admin-auth";
import { EditSongView } from "@/widgets/edit-song-view";

export default function AddSongPage() {
    return (
        <AdminAuthGate>
            <EditSongView />
        </AdminAuthGate>
    );
}
