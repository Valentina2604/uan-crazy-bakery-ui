'use client';

import { useRouter } from 'next/navigation';
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Locale } from "../../../i18n-config";
import type { getDictionary } from "@/lib/get-dictionary";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>['accountPage'];

export function AccountForm({ dictionary: t, lang }: { dictionary: Dictionary, lang: Locale }) {
  const router = useRouter();
  const { toast } = useToast();

  async function handleSignOut() {
    try {
        await signOut(auth);
        router.push(`/${lang}/login`);
    } catch (error: any) {
        toast({
          title: t.toast.error.title,
          description: t.toast.error.description,
          variant: "destructive",
        });
    }
  }

  if(!t) return null;

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-headline" role="heading">{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={handleSignOut} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
          {t.signOut}
        </Button>
      </CardContent>
    </Card>
  );
}
