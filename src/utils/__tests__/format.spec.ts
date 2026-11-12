import { describe, expect, it } from "vitest";
import { formatDate, formatLaunchCost } from "../format";

describe("formatLaunchCost", () => {
  it("formats numeric API values as USD", () => {
    expect(formatLaunchCost("52000000")).toBe("$52,000,000");
  });

  it("keeps free-text custom values as typed", () => {
    expect(formatLaunchCost("  $90 million ")).toBe("$90 million");
  });

  it("falls back when the value is missing", () => {
    expect(formatLaunchCost(null)).toBe("Not available");
    expect(formatLaunchCost("   ")).toBe("Not available");
  });
});

describe("formatDate", () => {
  it("formats an ISO date without timezone shift", () => {
    expect(formatDate("2010-06-04")).toBe("June 4, 2010");
  });

  it("returns the raw text when the date is invalid", () => {
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });

  it("falls back when the value is missing", () => {
    expect(formatDate(null)).toBe("Not available");
    expect(formatDate("")).toBe("Not available");
  });
});
