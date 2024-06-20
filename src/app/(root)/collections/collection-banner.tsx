import Image from "next/image";

export const CollectionBanner = () => {
  return (
    <section className="relative flex min-h-[20vh] flex-row gap-10">
      <Image
        className="z-0"
        src={`https://picsum.photos/1000/500?abc=233`}
        alt="Creativity image"
        fill
      />
      <div className="z-10 flex flex-1 bg-black/50">
        <div className="container flex flex-1 flex-col justify-center gap-4 text-white">
          <h1 className="text-5xl font-bold">Explore Our Collections</h1>
          <p className="text-lg">
            Discover our curated collections of products, each tailored to
            different styles and needs.
          </p>
        </div>
      </div>
    </section>
  );
};
