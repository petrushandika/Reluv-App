import { toast } from "sonner";
import axios from "axios";

export const handleApiError = (
  error: unknown,
  defaultMessage: string = "An unexpected error occurred."
) => {
  let errorMessage = defaultMessage;

  if (axios.isAxiosError(error)) {
    if (error.response?.data) {
      // The interceptor might have already flattened response.data to a string
      // or it might still be an object if the interceptor logic didn't catch it exactly as expected.
      if (typeof error.response.data === "string") {
        errorMessage = error.response.data;
      } else if (
        typeof error.response.data === "object" &&
        error.response.data !== null
      ) {
        const data = error.response.data as any;
        if (data.message) {
          errorMessage = Array.isArray(data.message)
            ? data.message.join(", ")
            : data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  toast.error("Error", {
    description: errorMessage,
  });

  return errorMessage; // Return in case the component wants to do something else with it
};
