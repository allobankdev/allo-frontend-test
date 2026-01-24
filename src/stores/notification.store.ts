import { defineStore } from "pinia";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    show: false,
    message: "",
    color: "success" as "success" | "error" | "info" | "warning",
    timeout: 1500,
  }),

  actions: {
    notify(
      message: string,
      color: "success" | "error" | "info" | "warning" = "success",
      timeout = 1500,
    ) {
      this.message = message;
      this.color = color;
      this.timeout = timeout;
      this.show = true;
    },

    close() {
      this.show = false;
    },
  },
});
