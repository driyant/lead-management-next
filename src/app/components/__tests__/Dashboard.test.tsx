import { ChakraProvider } from "@chakra-ui/react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Dashboard from "../Dashboard";
import { Lead } from "../../interface";

const { post, refresh } = vi.hoisted(() => ({
  post: vi.fn(),
  refresh: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh }),
}));

vi.mock("../../lib/api", () => ({
  default: { post },
}));

function renderDashboard(isLeadsLoading = false) {
  return render(
    <ChakraProvider>
      <Dashboard isLeadsLoading={isLeadsLoading} />
    </ChakraProvider>,
  );
}

function fillLeadForm() {
  fireEvent.change(screen.getByLabelText(/^Full Name/), {
    target: { value: "Jane Doe" },
  });
  fireEvent.change(screen.getByLabelText(/^Email Address/), {
    target: { value: "Jane.Doe+Sales @EXAMPLE.COM!" },
  });
  fireEvent.change(screen.getByLabelText("Initial Status"), {
    target: { value: "ENGAGED" },
  });
}

describe("Dashboard", () => {
  beforeEach(() => {
    post.mockReset();
    refresh.mockReset();
  });

  it("renders five table skeleton rows while leads are loading", () => {
    const { container } = renderDashboard(true);

    expect(container.querySelectorAll("tbody tr")).toHaveLength(5);
    expect(
      screen.queryByText("No leads found. Create your first lead!"),
    ).not.toBeInTheDocument();
  });

  it("submits normalized email data and refreshes the lead list", async () => {
    post.mockResolvedValueOnce({});
    renderDashboard();

    fillLeadForm();
    fireEvent.click(screen.getByRole("button", { name: "Save Lead" }));

    await waitFor(() => {
      expect(post).toHaveBeenCalledWith("/api/leads", {
        name: "Jane Doe",
        email: "jane.doe+sales@example.com",
        status: "ENGAGED",
      });
    });

    expect(refresh).toHaveBeenCalledOnce();
  });

  it("renders every known status and falls back for an unexpected status", () => {
    const statuses = [
      "NEW",
      "ENGAGED",
      "PROPOSAL_SENT",
      "CLOSED_WON",
      "CLOSED_LOST",
      "",
    ];
    const initialLeads = statuses.map(
      (status, index) =>
        ({
          id: String(index),
          name: `Lead ${index}`,
          email: `lead${index}@example.com`,
          status,
          createdAt: "2026-09-27T12:00:00.000Z",
        }) as Lead,
    );

    render(
      <ChakraProvider>
        <Dashboard initialLeads={initialLeads} />
      </ChakraProvider>,
    );

    initialLeads.forEach((lead) => {
      expect(screen.getByText(lead.name)).toBeInTheDocument();
    });
  });

  it("shows the API error message when a request fails", async () => {
    post.mockRejectedValueOnce({
      isAxiosError: true,
      response: { data: { message: "Email is already registered" } },
    });
    renderDashboard();

    fillLeadForm();
    fireEvent.click(screen.getByRole("button", { name: "Save Lead" }));

    expect(await screen.findByText("Error.")).toBeInTheDocument();
    expect(screen.getByText("Email is already registered")).toBeInTheDocument();
    expect(refresh).not.toHaveBeenCalled();
  });
});
