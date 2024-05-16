import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FC, PropsWithChildren } from "react";

interface Props {}

export const DesignSolutionSection: FC<PropsWithChildren<Props>> = () => {
  return (
    <section className="relative flex min-h-[40vh] flex-row gap-10">
      <Image
        className="z-0"
        src={`https://picsum.photos/1000/500?abc=efe`}
        alt="Creativity image"
        fill
      />
      <div className="z-10 flex flex-1  bg-black/40 ">
        <div className="container flex flex-1 flex-col justify-center gap-4 text-white ">
          <h1 className="text-5xl font-bold">
            Discover Unique Design Solutions Here
          </h1>
          <p className="text-lg">
            Explore our wide range of high-quality products and services for
            your fashion needs.
          </p>
          <div className="flex gap-5">
            <Button size="lg">Contact</Button>
            <Button size="lg" variant="outline" className="bg-transparent">
              Request
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
