import { HeroCinematic } from "@/components/HeroCinematic";
import { NooksguardSection } from "@/components/NooksguardSection";
import { ProductConfigurator } from "@/components/ProductConfigurator";
import { QuoteCalculator } from "@/components/QuoteCalculator";
import { ScrollExperience } from "@/components/ScrollExperience";
import { SectorShowcase } from "@/components/SectorShowcase";
import { getCategories } from "@/lib/catalog";
import { SECURITY_CATEGORIES } from "@/lib/nooksguard/categories";
import { ROOM_LAYOUT } from "@/components/room/room-layout";
import type { RoomItem } from "@/components/room/RoomScene";

export default async function Home() {
  // Flat product list so the quote calculator can attach a requested item
  // when a buyer arrives from the 360° viewer (/?product=<slug>#quote).
  const categories = await getCategories();
  const catalog = categories.flatMap((c) =>
    c.products.map((p) => ({ slug: p.slug, name: p.name, price: p.price, image: p.image }))
  );

  // Hero read-out figures, computed from the live data so they never go stale.
  const stats = {
    products: catalog.length,
    categories: categories.length,
    securityModels: SECURITY_CATEGORIES.filter((c) => c.status === "live").reduce(
      (sum, c) => sum + c.productCount,
      0
    ),
  };

  // Real catalog products for the hero's live 3D room. A product missing from
  // the catalog (e.g. deleted in the admin) is simply left out of the room.
  const productsBySlug = new Map(categories.flatMap((c) => c.products).map((p) => [p.slug, p]));
  const roomItems: RoomItem[] = ROOM_LAYOUT.flatMap((placement) => {
    const product = productsBySlug.get(placement.slug);
    return product ? [{ product, placement }] : [];
  });

  // Home-page inspector: the first product of every category, shown as its real photo.
  const inspectorItems = categories.flatMap((c) =>
    c.products[0] ? [{ product: c.products[0], category: { slug: c.slug, label: c.label } }] : []
  );

  return (
    <main id="top" className="flex flex-col">
      <HeroCinematic stats={stats} roomItems={roomItems} />
      {/* Studio-grey bands on alternating sections give the long page some rhythm;
          the page itself stays white. */}
      <div id="nooksguard" className="bg-studio">
        <NooksguardSection />
      </div>
      <div id="configurator">
        <ProductConfigurator items={inspectorItems} />
      </div>
      <div id="sectors">
        <SectorShowcase />
      </div>
      <div id="process">
        <ScrollExperience />
      </div>
      <div id="quote" className="bg-studio">
        <QuoteCalculator catalog={catalog} />
      </div>
    </main>
  );
}
