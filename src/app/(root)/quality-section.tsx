import { Button } from "@/components/ui/button";
import { ChevronRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FC, PropsWithChildren } from "react";

interface Props {}

export const QualitySection: FC<PropsWithChildren<Props>> = () => {
  return (
    <section className="container flex min-h-[50vh] flex-col gap-10 lg:flex-row">
      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <p className="w-full">Quality</p>
        <h1 className="text-5xl font-bold">Experience the Best in Design and Service</h1>
        <p className="text-lg">
          At Concepts Source Inc, we pride ourselves on our attention to design trends, providing high-quality service,
          and ensuring timely deliveries. With our extensive portfolio of collections for both men and women, we offer
          unique and hot-selling designs that meet the demands of various distribution channels.
        </p>
        <div className="w-full">
          <Button asChild variant="outline">
            <Link href="/about">Learn More</Link>
          </Button>
          <Button variant="link" asChild>
            <Link href="/about">
              <span> Register Now</span>
              <ChevronRightIcon />
            </Link>
          </Button>
        </div>
      </div>
      <div className="relative min-h-80 flex-1 overflow-hidden rounded-xl">
        <Image src={`https://picsum.photos/1000/1000?abc=eee`} alt="Creativity image" fill />
      </div>
    </section>
  );
};
