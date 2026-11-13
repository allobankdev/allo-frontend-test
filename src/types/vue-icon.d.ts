declare module '@jamescoyle/vue-icon' {
    const SvgIcon: import("vue").DefineComponent<{
      type?: string;
      path: string;
      size?: string | number;
      viewbox?: string;
      flip?: "horizontal" | "vertical" | "both" | "none";
      rotate?: number;
    }>;

    export default SvgIcon
}