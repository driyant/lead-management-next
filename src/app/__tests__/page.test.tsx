import { Suspense } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "../components/Dashboard";
import { leads } from "../constants";
import Page, { getLeads, LeadsDashboard } from "../page";

const { get } = vi.hoisted(() => ({
  get: vi.fn(),
}));

vi.mock("../lib/api", () => ({
  default: { get },
}));

describe("Page", () => {
  beforeEach(() => {
    get.mockReset();
  });

  it("renders a Suspense boundary with the dashboard skeleton fallback", () => {
    const page = Page();
    const suspense = page.props.children;

    expect(suspense.type).toBe(Suspense);
    expect(suspense.props.fallback.type).toBe(Dashboard);
    expect(suspense.props.fallback.props.isLeadsLoading).toBe(true);
  });

  it("returns leads supplied by the API", async () => {
    const apiLeads = [leads[0]];
    get.mockResolvedValueOnce({ data: { leads: apiLeads } });

    await expect(getLeads()).resolves.toEqual(apiLeads);
    expect(get).toHaveBeenCalledWith("/api/leads");
  });

  it("uses local leads when the API response has no leads", async () => {
    get.mockResolvedValueOnce({ data: {} });

    await expect(getLeads()).resolves.toEqual(leads);
  });

  it("uses local leads when the API request fails", async () => {
    const error = new Error("Network unavailable");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    get.mockRejectedValueOnce(error);

    await expect(getLeads()).resolves.toEqual(leads);
    expect(consoleError).toHaveBeenCalledWith("Error fetching leads:", error);

    consoleError.mockRestore();
  });

  it("passes fetched leads to Dashboard", async () => {
    const apiLeads = [leads[0]];
    get.mockResolvedValueOnce({ data: { leads: apiLeads } });

    const dashboard = await LeadsDashboard();

    expect(dashboard.type).toBe(Dashboard);
    expect(dashboard.props.initialLeads).toEqual(apiLeads);
  });
});
