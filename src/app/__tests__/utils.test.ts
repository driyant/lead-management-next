import { describe, expect, it } from "vitest";
import {
  formattedDate,
  formatStatusLabel,
  mapStatusToBackend,
  normalizeEmail,
} from "../utils";

describe("mapStatusToBackend", () => {
  it.each([
    ["NEW", "New"],
    ["ENGAGED", "Engaged"],
    ["PROPOSAL_SENT", "Proposal Sent"],
    ["CLOSED_WON", "Closed-Won"],
    ["CLOSED_LOST", "Closed-Lost"],
    ["UNKNOWN", "New"],
  ])("maps %s to %s", (status, expectedStatus) => {
    expect(mapStatusToBackend(status)).toBe(expectedStatus);
  });
});

describe("formatStatusLabel", () => {
  it("returns NEW when the status is empty", () => {
    expect(formatStatusLabel("")).toBe("NEW");
  });

  it("uppercases the supplied status", () => {
    expect(formatStatusLabel("engaged")).toBe("ENGAGED");
  });
});

describe("formattedDate", () => {
  it("formats a date with the expected English month, day, and year", () => {
    expect(formattedDate("2026-09-27T12:00:00.000Z")).toBe("Sep 27, 2026");
  });
});

describe("normalizeEmail", () => {
  it("lowercases an email and removes unsupported characters", () => {
    expect(normalizeEmail("John.Doe+Sales @Example.COM!")).toBe(
      "john.doe+sales@example.com",
    );
  });
});
