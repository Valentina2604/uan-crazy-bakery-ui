'use client';

import { SessionProvider } from '@/context/session-provider';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
