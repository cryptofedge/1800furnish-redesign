import { HeroCinematic } from "@/components/HeroCinematic";
import { ProductConfigurator } from "@/components/ProductConfigurator";
import { QuoteCalculator } from "@/components/QuoteCalculator";
import { ScrollExperience } from "@/components/ScrollExperience";
import { SectorShowcase } from "@/components/SectorShowcase";
import { getCategories } from "@/lib/catalog";

export default async function Home() {
  // Flat product list so the quote calculator can attach a requested item
  // when a buyer arrives from the 360° viewer (/?product=<slug>#quote).
  const categories = await getCategories();
  const catalog = categories.flatMap((c) =>
    c.products.map((p) => ({ slug: p.slug, name: p.name, price: p.price }))
  );

  return (
    <main id="top" className="flex flex-col">
      <HeroCinematic />
      <div id="configurator">
        <ProductConfigurator />
      </div>
      <div id="sectors">
        <SectorShowcase />
      </div>
      <div id="process">
        <ScrollExperience />
      </div>
      <div id="quote">
        <QuoteCalculator catalog={catalog} />
      </div>
    </main>
  );
}
