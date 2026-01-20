import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n-config';
import ProductsList from '@/components/admin/products/products-list';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { getProducts } from '@/lib/api';

export default async function ProductsPage({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  const initialProducts = await getProducts();

  return (
    <div className="space-y-6 w-full min-h-[calc(100vh-8rem)] p-4 md:p-8">
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href={`/${lang}/dashboard/admin`}>{dictionary.adminProductsPage.breadcrumb}</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    <BreadcrumbPage>{dictionary.adminProductsPage.title}</BreadcrumbPage>
                </BreadcrumbItem>
            </BreadcrumbList>
        </Breadcrumb>
      <ProductsList dictionary={dictionary} initialProducts={initialProducts} />
    </div>
  );
}
