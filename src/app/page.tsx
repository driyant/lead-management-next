// src/app/page.tsx
import Dashboard from "../app/components/Dashboard";
import { Box } from "@chakra-ui/react";
import { Lead } from "../app/interface";
import api from "../app/lib/api";
import { leads } from "../app/constants";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export async function getLeads(): Promise<Lead[]> {
  try {
    const response = await api.get("/api/leads");
    return response.data.leads || leads;
  } catch (error) {
    console.error("Error fetching leads:", error);
    return leads;
  }
}

export async function LeadsDashboard() {
  const leads = await getLeads();

  return <Dashboard initialLeads={leads} />;
}

export default function Page() {
  return (
    <Box minH="100vh" bg="gray.50">
      <Suspense fallback={<Dashboard isLeadsLoading />}>
        <LeadsDashboard />
      </Suspense>
    </Box>
  );
}
