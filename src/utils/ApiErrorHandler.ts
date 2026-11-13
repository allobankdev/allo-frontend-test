import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        return `Request failed : ${error.response.data.detail}.`;
      }

      if (error.request) {
        return "Unable to reach the server. Please check your connection.";
      }
    }

    return 'An unexpected error occured'
}