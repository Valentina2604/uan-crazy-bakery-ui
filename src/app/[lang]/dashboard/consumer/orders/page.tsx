
import { Locale } from "../../../../../../i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { OrdersList } from "@/components/consumer/orders/orders-list";

export default async function ConsumerOrdersPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] p-4 md:p-8">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${lang}/dashboard/consumer`}>{dictionary.consumerDashboard.title}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{dictionary.consumerOrders.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className="text-3xl font-headline mb-4">{dictionary.consumerOrders.title}</h1>
      <p className="text-muted-foreground mb-8">{dictionary.consumerOrders.description}</p>
      
      <OrdersList dictionary={dictionary} />
    </div>
  );
}
