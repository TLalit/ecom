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

interface IConfirmationDialog {
  isOpen: boolean;
  severity?: "destructive" | "default";
  onConfirm: () => Promise<void>;
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
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(
              buttonVariants({
                variant: severity,
              }),
            )}
          >
            {confirmIcon && <LucideIcon name={confirmIcon} />}
            <span>{confirmText}</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
