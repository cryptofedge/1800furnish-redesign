import { getCategories } from "@/lib/catalog";
import { CategoryNav } from "@/components/CategoryNav";

// Product pages sit under the same category tab bar as the catalog.
export default async function ProductsLayout({ children }: { children: React.ReactNode }) {
  const categories = await getCategories();
  const navCategories = categories.map(({ slug, label }) => ({ slug, label }));

  return (
    <div className="pt-[72px]">
      <CategoryNav categories={navCategories} />
      <main>{children}</main>
    </div>
  );
}
