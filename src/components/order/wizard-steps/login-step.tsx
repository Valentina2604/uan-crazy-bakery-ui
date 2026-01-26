'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getDictionary } from "@/lib/get-dictionary";

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;

interface LoginStepProps {
  dictionary: Dictionary;
  onLoginSuccess: () => void; // Función para notificar el éxito
}

export function LoginStep({ dictionary: t, onLoginSuccess }: LoginStepProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    email: z.string().email({ message: t.loginForm.validation.email }),
    password: z.string().min(8, { message: t.loginForm.validation.password }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      const { uid } = userCredential.user;

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid }),
      });

      if (!response.ok) throw new Error('Failed to create session');

      // En lugar de redirigir, llamamos al callback
      onLoginSuccess();

    } catch (error) {
      toast({
        title: t.loginForm.toast.error.title,
        description: t.loginForm.toast.error.description,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  if (!t) return null;

  return (
    <div className="w-full max-w-md mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.loginForm.email.label}</FormLabel>
                <FormControl>
                  <Input placeholder={t.loginForm.email.placeholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.loginForm.password.label}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? t.orderWizard.buttons.saving : t.loginForm.submit}
          </Button>
        </form>
      </Form>
    </div>
  );
}
