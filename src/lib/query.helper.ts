import { GenericErrorResponse } from "@/types/generic.api.types";
import { AxiosError } from "axios";
import { toast } from "sonner";

export const errorHandler =
  (callback?: (args: { message?: string }) => void) =>
  (error: AxiosError<GenericErrorResponse> | Error) => {
    if ("response" in error) {
      if (callback) {
        callback({
          message: error.response?.data.message,
        });
        return;
      } else {
        toast.error(error.response?.data.message);
        return;
      }
    }
    toast.error("Something went wrong.", {
      description: "Please try again later.",
    });
  };
