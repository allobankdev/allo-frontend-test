import type { RouteRecordRaw } from "vue-router";

declare module "vue-router/auto" {
  export * from "vue-router";
}

declare module "vue-router/auto-routes" {
  export const routes: RouteRecordRaw[];
}
