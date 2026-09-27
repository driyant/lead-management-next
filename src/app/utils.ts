export const mapStatusToBackend = (status: string): string => {
  switch (status) {
    case "NEW":
      return "New";
    case "ENGAGED":
      return "Engaged";
    case "PROPOSAL_SENT":
      return "Proposal Sent";
    case "CLOSED_WON":
      return "Closed-Won";
    case "CLOSED_LOST":
      return "Closed-Lost";
    default:
      return "New";
  }
};

export const formatStatusLabel = (status: string): string => {
  if (!status) return "NEW";
  return status.toUpperCase();
};

export const formattedDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const normalizeEmail = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9@._+-]/g, "");
