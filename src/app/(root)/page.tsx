import { DesignSolutionSection } from "./design-solution-section";
import { FeaturedProducts } from "./featured-products";
import { HeroSection } from "./hero-section";
import { QualitySection } from "./quality-section";

export default async function Home() {
  return (
    <main className="flex flex-col gap-40">
      <HeroSection />
      <FeaturedProducts />
      <QualitySection />
      <DesignSolutionSection />
    </main>
  );
}
