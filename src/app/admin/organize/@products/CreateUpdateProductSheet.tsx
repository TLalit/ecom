import { GetAllProductResponse } from "@/actions/product.actions";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Row } from "@tanstack/react-table";

export const CreateUpdateProductSheet = ({
  children,
  mode,
}: {
  children: React.ReactNode;
  mode: "Create" | "Update";
  row?: Row<GetAllProductResponse[number]>;
}) => {
  return (
    <Sheet>
      {children}
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Product</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};
