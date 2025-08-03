export const nameRules = [
  (v: string) => !!v || "Rocket name is required",
  (v: string) => (v && v.length >= 2) || "Name must be at least 2 characters",
];

export const requiredRules = [(v: string) => !!v || "This field is required"];

export const dateRules = [
  (v: string) => !!v || "Date is required",
  (v: string) => {
    const date = new Date(v);
    return !isNaN(date.getTime()) || "Invalid date";
  },
];

export const numberRules = [
  (v: number) => v >= 0 || "Value must be positive",
  (v: number) => !isNaN(v) || "Must be a valid number",
];

export const percentageRules = [
  ...numberRules,
  (v: number) => (v >= 0 && v <= 100) || "Percentage must be between 0 and 100",
];

export const urlRules = [
  (v: string) => {
    if (!v) return true; // Optional field
    try {
      new URL(v);
      return true;
    } catch {
      return "Must be a valid URL";
    }
  },
];

export const descriptionRules = [
  (v: string) => !!v || "Description is required",
  (v: string) =>
    (v && v.length >= 10) || "Description must be at least 10 characters",
  (v: string) =>
    (v && v.length <= 1000) || "Description must be less than 1000 characters",
];
