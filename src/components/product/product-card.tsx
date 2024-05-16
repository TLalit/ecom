"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
export const ProductCard = ({
  product,
}: {
  product: {
    imageUrl: string;
    name: string;
    description: string;
  };
}) => {
  return (
    <Card className="overflow-hidden shadow-lg">
      <Link href="#">
        <CardHeader className="p-0 pb-4">
          <div className="relative aspect-square">
            <Image src={product.imageUrl} fill alt="" />
          </div>
        </CardHeader>
        <CardContent>
          <CardTitle className="text-xl font-bold">{product.name}</CardTitle>
          <CardDescription className="line-clamp-1">
            {product.description}
          </CardDescription>
        </CardContent>
        <CardFooter className="flex justify-between gap-4">
          <span className="text-lg font-bold">$99.99</span>

          <Button size="sm">View Details</Button>
        </CardFooter>
      </Link>
    </Card>
  );
};
