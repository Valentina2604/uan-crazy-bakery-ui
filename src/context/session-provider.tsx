'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserById } from '@/lib/api';

export type SessionUser = FirebaseUser & { tipo?: string };

interface SessionContextProps {
  user: SessionUser | null;
  loading: boolean;
}

const SessionContext = createContext<SessionContextProps>({ user: null, loading: true });

export const useSession = () => useContext(SessionContext);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Add a delay and retry mechanism to wait for backend user creation
        let appUser = null;
        for (let i = 0; i < 5; i++) { // Retry up to 5 times
          try {
            const fetchedUser = await getUserById(firebaseUser.uid);
            if (fetchedUser && fetchedUser.tipo) {
              appUser = fetchedUser;
              break; // User found, exit loop
            }
          } catch (error) {
            // Ignore errors during retries, as the user might not exist yet
          }
          await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retrying
        }

        if (appUser) {
          setUser({ ...firebaseUser, ...appUser });
        } else {
          // If user data is still not found, then sign out
          console.error("Failed to fetch user data after multiple attempts, signing out.");
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <SessionContext.Provider value={{ user, loading }}>
      {children}
    </SessionContext.Provider>
  );
};
