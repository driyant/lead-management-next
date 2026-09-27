"use client";

import { ChakraProvider } from "@chakra-ui/react";
import { CacheProvider } from "@emotion/react";
import { useEmotionCache } from "@chakra-ui/next-js/use-emotion-cache";
import theme from "./theme";

export function Providers({ children }: { children: React.ReactNode }) {
  const emotionCache = useEmotionCache();

  return (
    <CacheProvider value={emotionCache}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </CacheProvider>
  );
}
