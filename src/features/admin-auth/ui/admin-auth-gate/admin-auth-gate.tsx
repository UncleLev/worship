'use client';

import { ReactNode, Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAdminAuth } from '@/features/admin-auth/model/use-admin-auth';
import SignInView from '@/features/admin-auth/ui/sign-in-view/sign-in-view';

interface AdminAuthGateProps {
  children: ReactNode;
}

function AdminAuthGateInner({ children }: AdminAuthGateProps) {
  const { state, signIn, error } = useAdminAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  useEffect(() => {
    if (state === 'authenticated' && redirect) {
      router.push(redirect);
    }
  }, [state, redirect, router]);

  if (state === 'loading') return null;
  if (state === 'unauthenticated')
    return <SignInView onSignIn={signIn} error={error} />;

  return <>{children}</>;
}

export default function AdminAuthGate({ children }: AdminAuthGateProps) {
  return (
    <Suspense fallback={null}>
      <AdminAuthGateInner>{children}</AdminAuthGateInner>
    </Suspense>
  );
}
