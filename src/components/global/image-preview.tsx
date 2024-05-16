"use client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import Image, { ImageProps } from "next/image";
import { forwardRef, useEffect, useState } from "react";
import { create } from "zustand";
import { LucideIcon } from "../icons/icon";
import { Button } from "../ui/button";
import { Dialog, DialogContent } from "../ui/dialog";

export const PreviewImage = forwardRef<HTMLImageElement, ImageProps>(
  ({ alt = "image", className, ...props }, ref) => (
    <Image
      ref={ref}
      alt={alt}
      className={cn("rounded-xl border", className)}
      {...props}
    />
  ),
);

PreviewImage.displayName = "PreviewImage";

export const ImageList = ({
  images,
  scroll = false,
  onRemove,
}: {
  images: (Omit<Partial<ImageProps>, "src"> & { src: string })[];
  scroll?: boolean;
  onRemove?: (image: { src: string; index: number }) => void;
}) => {
  return (
    <div
      className={clsx("flex gap-4", scroll ? "overflow-x-auto" : "flex-wrap")}
    >
      {images.map(({ src, alt = "image", className, ...rest }, index) => {
        if (!src) return null;
        return (
          <div key={index} className="relative">
            <PreviewImage
              onClick={() =>
                useImagePreviewStore.setState({
                  images: images.map((item) => ({ src: item.src })),
                  startFrom: src,
                })
              }
              width={96}
              height={96}
              className={cn("cursor-pointer object-contain", className)}
              src={src}
              alt={alt}
              {...rest}
            />
            {onRemove && (
              <Button
                onClick={() => onRemove?.({ src, index: index })}
                size="icon"
                variant="destructive"
                className="absolute -right-1 -top-1 size-5 rounded-full"
              >
                <LucideIcon name="Minus" />
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const ImageViewer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { images } = useImagePreviewStore();
  const handleClose = () => {
    setTimeout(
      () => useImagePreviewStore.setState({ images: [], startFrom: "" }),
      50,
    );
    setIsOpen(false);
  };

  useEffect(() => {
    if (images.length) setIsOpen(true);
  }, [images.length]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="flex max-w-screen-md flex-col gap-5">
        <Carousel>
          <CarouselSlides />
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};
const CarouselSlides = () => {
  const { images, startFrom } = useImagePreviewStore();

  const startIndex = images.findIndex((img) => img.src === startFrom);
  const { api } = useCarousel();
  useEffect(() => {
    if (startIndex === -1) return;
    api?.scrollTo(startIndex);
  }, [api, startIndex]);
  return (
    <>
      <CarouselContent>
        {images.map(({ src }, i) => (
          <CarouselItem key={i} className="relative aspect-square">
            <Image alt="" src={src} fill className="object-contain" />
          </CarouselItem>
        ))}
      </CarouselContent>
      {images.length > 1 && (
        <>
          <CarouselPrevious className="-left-24" />
          <CarouselNext className="-right-24" />
        </>
      )}
    </>
  );
};

export const useImagePreviewStore = create<{
  images: { src: string }[];
  startFrom: string;
}>((set, get) => ({
  images: [],
  startFrom: "",
}));
