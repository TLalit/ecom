"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import { create } from "zustand";
import { IconProps, LucideIcon } from "../icons/icon";
import { buttonVariants } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { errorHandler } from "@/lib/query.helper";
import { useEffect } from "react";

interface IConfirmationDialog {
  isOpen: boolean;
  severity?: "destructive" | "default";
  onConfirm: () => Promise<unknown>;
  title: string;
  description?: string;
  confirmText: string;
  confirmIcon?: IconProps["name"];
}
const initialState = {
  isOpen: false,
  confirmText: "Continue",
  title: "Are you absolutely sure?",
  description: `This action cannot be undone.`,
  onConfirm: async () => {},
};
const useConfirmationStore = create<IConfirmationDialog>(
  (set, get) => initialState,
);
export const confirmBeforeAction = (
  onConfirm: IConfirmationDialog["onConfirm"],
  options?: Omit<IConfirmationDialog, "onConfirm" | "isOpen">,
) => {
  useConfirmationStore.setState({
    isOpen: true,
    onConfirm,
    ...options,
  });
};

export const ConfirmationDialog = () => {
  const {
    confirmText,
    title,
    description,
    severity,
    confirmIcon,
    onConfirm,
    isOpen,
  } = useConfirmationStore();

  const confirmMutation = useMutation({
    mutationKey: ["confirmMutation"],
    mutationFn: onConfirm,
    onSuccess: () => {
      console.log("success");
      onOpenChange(false);
    },
    onError: (error) => {
      onOpenChange(false);
      errorHandler();
    },
  });

  const onOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      useConfirmationStore.setState({
        isOpen: true,
      });
    }

    useConfirmationStore.setState(initialState);
  };

  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => confirmMutation.mutate()}
            className={cn(
              buttonVariants({
                variant: severity,
              }),
            )}
          >
            {confirmIcon && <LucideIcon name={confirmIcon} />}
            {confirmMutation.isPending ? (
              <LucideIcon
                name="LoaderCircle"
                className="absolute animate-spin"
              />
            ) : (
              <span>{confirmText}</span>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
