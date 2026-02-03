import { OrderManagementPage } from '@/components/admin/order-management/order-management-page';
import { getDictionary } from '@/lib/get-dictionary';
import { Locale } from '@/i18n-config';

export default async function OrderManagement({ params: { lang } }: { params: { lang: Locale } }) {
  const dictionary = await getDictionary(lang);
  return <OrderManagementPage dictionary={dictionary} lang={lang} />;
}
