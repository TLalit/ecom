import { Container } from "@/components/global";
import { LucideIcon } from "@/components/icons/icon";
import { Button } from "@/components/ui/button";
import { TeamTable } from "./TeamTable";

export default function Page() {
  return (
    <Container className="flex flex-1 flex-col gap-5 rounded-2xl bg-background py-8">
      <section className="relative flex justify-between gap-4">
        <div>
          <h1 className="flex-1 text-2xl font-bold">Team</h1>
          <span>Manage the team for your store</span>
        </div>
        <div className="actions flex gap-4">
          <Button>
            <LucideIcon name="Plus" />
            <span>Add </span>
          </Button>
        </div>
      </section>
      <TeamTable />
    </Container>
  );
}
