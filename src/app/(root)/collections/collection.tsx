import { CollectionCard } from "@/components/collections/collection-card";

const collections = Array.from({ length: 12 }, (_, index) => ({
  name: "Collection Title",
  description:
    "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Odit quibusdam consequatur enim. Deserunt, mollitia!officiis unde cupiditate minus repudiandae accusamus.",
  imageUrl: `https://picsum.photos/1000/600?abc=${index}`,
}));

export const Collections = () => {
  return (
    <section className="container grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {collections.map((collection, index) => (
        <CollectionCard collection={collection} key={index} />
      ))}
    </section>
  );
};
