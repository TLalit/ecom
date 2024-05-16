import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FC, PropsWithChildren } from "react";

interface Props {}

export const FeaturedProducts: FC<PropsWithChildren<Props>> = () => {
  return (
    <section className="flex flex-col items-center gap-10">
      <span>Discover</span>
      <h1 className="text-center text-6xl font-bold">Featured</h1>
      <p>Explore our collection of high-quality products.</p>
      <div className="container grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array(8)
          .fill(null)
          .map((_, index) => (
            <ProductCard
              product={{
                imageUrl: `https://picsum.photos/400/600?abc=${index}`,
                description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit minima rem pariatur iste ipsa obcaecati perferendis, eligendi distinctio, nemo debitis optio, nesciunt unde repellat doloremque minus deserunt neque tempora porro.`,
                name: `Stylish Sunglasses ${index + 1}`,
              }}
              key={index}
            />
          ))}
      </div>
      <div>
        <Button asChild size="lg">
          <Link href="/products">View All</Link>
        </Button>
      </div>
    </section>
  );
};
