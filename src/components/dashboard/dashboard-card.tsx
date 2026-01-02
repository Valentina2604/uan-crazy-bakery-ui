
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Locale } from '../../../../i18n-config';

interface DashboardCardProps {
  href: string;
  title: string;
  description: string;
  lang: Locale;
}

export function DashboardCard({ href, title, description, lang }: DashboardCardProps) {
  return (
    (<Link href={`/${lang}${href}`} className="block hover:bg-gray-50 dark:hover:bg-gray-800">

      <Card className='h-full'>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
      </Card>
    </Link>)
  );
}
