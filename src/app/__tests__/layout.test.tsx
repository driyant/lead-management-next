import { describe, expect, it, vi } from "vitest";

vi.mock("../providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => children,
}));

import RootLayout, { metadata } from "../layout";
import { Providers } from "../providers";

describe("RootLayout", () => {
  it("sets the document metadata and wraps children with Providers", () => {
    const layout = RootLayout({ children: <p>Dashboard content</p> });
    const body = layout.props.children;
    const provider = body.props.children;

    expect(metadata).toMatchObject({
      title: "Lead Manager",
      description: "Simple Lead Management System",
    });
    expect(layout.type).toBe("html");
    expect(layout.props.lang).toBe("en");
    expect(body.type).toBe("body");
    expect(provider.type).toBe(Providers);
    expect(provider.props.children.props.children).toBe("Dashboard content");
  });
});
