"use client";
import { FlipWords } from "@/components/ace/flip-words";
import { MovingCards } from "@/components/ace/moving-cards";
import { ProductCard } from "@/components/product/product-card";
import Image from "next/image";
import { FC, PropsWithChildren } from "react";
interface Props {}
const words = ["better", "cute", "beautiful", "modern"].map((word) =>
  word.toUpperCase(),
);
export const HeroSection: FC<PropsWithChildren<Props>> = () => {
  return (
    <>
      <section className="container flex min-h-[50vh] flex-col gap-10 lg:flex-row">
        <div className="flex flex-1 flex-col items-center justify-center gap-4 ">
          <h1 className="w-full text-5xl font-bold">
            Designing <FlipWords words={words} />
          </h1>
          <p className="text-lg">
            Concepts Source Inc is a leading design and manufacturing company,
            specializing in garments, scarves, jewelry, and home fashion
            products. With a focus on unique designs, high-quality services, and
            timely deliveries, we cater to the fashion needs of both men and
            women, offering collections for various distribution channels.
          </p>
        </div>
        <HeroSectionProductHighlight />
      </section>
      <section className="container flex min-h-[50vh] flex-col gap-10 lg:flex-row">
        <div className="relative min-h-80 flex-1 overflow-hidden rounded-xl">
          <Image
            src={`https://picsum.photos/200/300?abc=fff`}
            alt="Creativity image"
            fill
          />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-4 ">
          <h1 className="text-5xl font-bold">
            Unleash Your Creativity with Our Custom Design and Manufacturing
            Capabilities
          </h1>
          <p className="text-lg">
            At Concepts Source Inc, we specialize in creating unique and
            customized designs for garments, scarves, jewelries, and home
            fashion products. With our high-quality services and timely
            deliveries, we ensure that your vision becomes a reality.
          </p>
        </div>
      </section>
    </>
  );
};

export const HeroSectionProductHighlight = () => {
  const product = Array(20)
    .fill(null)
    .map((_, index) => (
      <ProductCard
        key={index}
        product={{
          imageUrl: `https://picsum.photos/400/600?abc=${index}`,
          description: `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Reprehenderit minima rem pariatur iste ipsa obcaecati perferendis, eligendi distinctio, nemo debitis optio, nesciunt unde repellat doloremque minus deserunt neque tempora porro.`,
          name: `Stylish Sunglasses ${index + 1}`,
        }}
      />
    ));
  const half = Math.ceil(product.length / 2);
  const firstPart = product.slice(0, half);
  const secondPart = product.slice(half, 2 * half);

  return (
    <div className="flex flex-1  overflow-y-hidden ">
      <MovingCards className="h-[50vh] px-2" speed="slow" items={firstPart} />
      <MovingCards
        speed="slow"
        className="h-[50vh] px-2 pt-60"
        items={secondPart}
      />
    </div>
  );
};
