"use client";

import { AdminAuthGate } from "@/features/admin-auth";

export default function ManagePage() {
    return (
        <AdminAuthGate>
            <p>Admin area</p>
        </AdminAuthGate>
    );
}
