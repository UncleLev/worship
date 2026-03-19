"use client";

import { useCallback, useEffect, useState } from "react";
import supabase from "@/shared/lib/supabase-browser";

export type AdminAuthState = "loading" | "unauthenticated" | "authenticated";

export function useAdminAuth() {
    const [state, setState] = useState<AdminAuthState>("loading");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setState(data.session ? "authenticated" : "unauthenticated");
        });
    }, []);

    const signIn = useCallback(async (email: string, password: string) => {
        setError(null);
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) {
            setError(authError.message);
        } else {
            setState("authenticated");
        }
    }, []);

    const signOut = useCallback(async () => {
        await supabase.auth.signOut();
        setState("unauthenticated");
    }, []);

    return { state, signIn, signOut, error };
}
