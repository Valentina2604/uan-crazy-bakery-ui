import { getDictionary } from "@/lib/get-dictionary";
import { Locale } from "../../../i18n-config";
import { OrderWizardModal } from "@/components/order/order-wizard-modal";

export default async function OrderPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return <OrderWizardModal lang={lang} dictionary={dictionary} />;
}
