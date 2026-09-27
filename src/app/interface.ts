export type LeadStatus =
  | "NEW"
  | "ENGAGED"
  | "PROPOSAL_SENT"
  | "CLOSED_WON"
  | "CLOSED_LOST";

export interface Lead {
  id: string;
  name: string;
  email: string;
  status: LeadStatus;
  createdAt: string;
}
