"use client";

import { AdminAuthGate } from "@/features/admin-auth";
import { AdminSongList } from "@/widgets/admin-song-list";

export default function ManagePage() {
    return (
        <AdminAuthGate>
            <AdminSongList />
        </AdminAuthGate>
    );
}
