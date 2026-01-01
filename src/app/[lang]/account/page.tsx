export const dynamic = 'force-dynamic';
import { AccountForm } from "@/components/auth/account-form";
import { Locale } from "../../../../i18n-config";
import { getDictionary } from "@/lib/get-dictionary";

export default async function AccountPage({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);
  return (
    <div className="w-full min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <AccountForm dictionary={dictionary.accountForm} />
    </div>
  );
}
