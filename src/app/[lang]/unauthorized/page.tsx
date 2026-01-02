
import Link from "next/link";
import { Locale } from "../../../../i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function UnauthorizedPage({ params: { lang } }: { params: { lang: Locale }}) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline" role="heading">{dictionary.unauthorized.title}</CardTitle>
          <CardDescription>{dictionary.unauthorized.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href={`/${lang}`}>
            <Button className="w-full">{dictionary.unauthorized.backToHome}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
