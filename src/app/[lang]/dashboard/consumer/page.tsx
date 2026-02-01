
import { Locale } from "../../../../../i18n-config";
import { getDictionary } from "@/lib/get-dictionary";
import { DashboardCard } from "@/components/dashboard/dashboard-card";

export default async function ConsumerDashboardPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <div className="w-full min-h-[calc(100vh-8rem)] p-4 md:p-8">
      <h1 className="text-3xl font-headline mb-4">{dictionary.consumerDashboard.title}</h1>
      <p className="text-muted-foreground mb-8">{dictionary.consumerDashboard.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          lang={lang}
          href="/dashboard/consumer/orders"
          title={dictionary.consumerDashboard.cards.orders.title}
          description={dictionary.consumerDashboard.cards.orders.description}
        />
        {/* Add more cards here */}
      </div>
    </div>
  );
}
