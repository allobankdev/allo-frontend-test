/* eslint-disable @typescript-eslint/no-explicit-any */
export const filteringData = <T extends Record<string, any>>(
  data: T[],
  filter: any,
): T[] => {
  return [...data].filter((item) =>
    Object.keys(filter).every((key) => {
      const typedKey = key as keyof T;
      const filterValue = filter[typedKey];

      if (typedKey === "search" && typeof filterValue === "string") {
        return item.name?.toLowerCase().includes(filterValue.toLowerCase());
      }

      return (
        filterValue === undefined ||
        filterValue === "" ||
        filterValue === null ||
        item[typedKey] === filterValue
      );
    })
  );
};

export const getDataFromLocalStorage = (key: string) => {
  const existingData = localStorage.getItem(key);
  const data = existingData ? JSON.parse(existingData) : [];
  return data;
}