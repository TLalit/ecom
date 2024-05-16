import { Collections } from "./collection";
import { CollectionBanner } from "./collection-banner";

export default function Page() {
  return (
    <main className="flex flex-col gap-20">
      <CollectionBanner />
      <Collections />
    </main>
  );
}
