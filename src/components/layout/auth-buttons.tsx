'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogIn, LogOut, User } from 'lucide-react';
import { signOut as firebaseSignOut } from 'firebase/auth';
import { useSession, SessionUser } from '@/context/session-provider';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getInitials } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface AuthButtonsProps {
  lang: string;
  dictionary: {
    login: string;
    signUp: string;
    myAccount: string;
    logout: string;
    dashboard?: string; 
  };
}

// Helper function to determine the account link
const getAccountLink = (user: SessionUser | null, lang: string): string => {
  if (!user || typeof user.tipo !== 'string') {
    return `/${lang}/login`;
  }

  const userType = user.tipo.toLowerCase();

  if (userType === 'administrador') {
    return `/${lang}/dashboard/admin`;
  }

  if (userType === 'consumidor') {
    return `/${lang}/dashboard/consumer`;
  }

  return `/${lang}/login`;
};

export function AuthButtons({ lang, dictionary }: AuthButtonsProps) {
  const { user, loading } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error("Failed to logout from API", error);
    } finally {
      await firebaseSignOut(auth);
      router.push(`/${lang}`);
      router.refresh(); 
    }
  };

  if (loading) {
    return <Skeleton className="h-10 w-40" />;
  }

  const accountLink = getAccountLink(user, lang);
  const userName = user?.displayName || user?.email || 'User';
  const userEmail = user?.email || '';

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                {user.photoURL && <AvatarImage src={user.photoURL} alt={userName} />}
                <AvatarFallback>{getInitials(userName)}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{userName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {userEmail}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={accountLink}>
                <User className="mr-2 h-4 w-4" />
                <span>{dictionary.myAccount}</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{dictionary.logout}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
       <Button asChild variant="ghost">
          <Link href={`/${lang}/login`}>
             <LogIn className="mr-2 h-5 w-5" />
             {dictionary.login}
          </Link>
        </Button>
        <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href={`/${lang}/register`}>{dictionary.signUp}</Link>
        </Button>
    </div>
  );
}
