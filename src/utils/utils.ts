import type { Crew } from "@/types/crew.type";

export type CategoryOption = { text: string; value: string };

export function generateCategories(astronauts: Crew[] | []): {
  status: CategoryOption[];
  agency: CategoryOption[];
} {
  const statusSet = new Set<string>();
  const agencySet = new Set<string>();

  for (const { status, agency } of astronauts) {
    if (status) statusSet.add(status);
    if (agency) agencySet.add(agency);
  }

  const toOptions = (
    items: Set<string>,
    formatText?: (text: string) => string
  ): CategoryOption[] =>
    Array.from(items).map((item) => ({
      text: formatText ? formatText(item) : item,
      value: item,
    }));

  return {
    status: toOptions(statusSet, (s) => s.charAt(0).toUpperCase() + s.slice(1)),
    agency: toOptions(agencySet),
  };
}
