"use client";

import { ReactNode } from "react";
import { useAdminAuth } from "@/features/admin-auth/model/use-admin-auth";
import SignInView from "@/features/admin-auth/ui/sign-in-view/sign-in-view";

interface AdminAuthGateProps {
    children: ReactNode;
}

export default function AdminAuthGate({ children }: AdminAuthGateProps) {
    const { state, signIn, error } = useAdminAuth();

    if (state === "loading") return null;
    if (state === "unauthenticated") return <SignInView onSignIn={signIn} error={error} />;

    return <>{children}</>;
}
