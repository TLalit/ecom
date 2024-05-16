import { DirectionAwareHover } from "../ace/direction-aware-hover";

export const CollectionCard = ({
  collection,
}: {
  collection: {
    imageUrl: string;
    name: string;
    description: string;
  };
}) => {
  return (
    <DirectionAwareHover imageUrl={collection.imageUrl}>
      <p className="pr-4 text-xl font-bold">{collection.name}</p>
      <p className="line-clamp-2 pr-4 text-sm font-normal">
        {collection.description}
      </p>
    </DirectionAwareHover>
  );
};
