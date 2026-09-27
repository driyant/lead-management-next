import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const { useEmotionCache } = vi.hoisted(() => ({
  useEmotionCache: vi.fn(() => ({ key: "test-cache" })),
}));

vi.mock("@chakra-ui/react", () => ({
  ChakraProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chakra-provider">{children}</div>
  ),
  extendTheme: <T,>(theme: T) => theme,
}));

vi.mock("@emotion/react", () => ({
  CacheProvider: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: { key: string };
  }) => <div data-cache-key={value.key}>{children}</div>,
}));

vi.mock("@chakra-ui/next-js/use-emotion-cache", () => ({
  useEmotionCache,
}));

import { Providers } from "../providers";

describe("Providers", () => {
  it("provides the Emotion cache and Chakra context to its children", () => {
    render(
      <Providers>
        <p>Dashboard content</p>
      </Providers>,
    );

    expect(useEmotionCache).toHaveBeenCalledOnce();
    expect(screen.getByTestId("chakra-provider")).toHaveTextContent(
      "Dashboard content",
    );
  });
});
