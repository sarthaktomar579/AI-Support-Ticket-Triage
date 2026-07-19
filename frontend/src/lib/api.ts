export type Ticket = {
  id: number;
  name: string;
  email: string;
  message: string;
  priority: "Low" | "Medium" | "High" | null;
  category: "Billing" | "Bug" | "Feature Request" | "Other" | null;
  suggestedReply: string | null;
  aiStatus: "pending" | "success" | "failed";
  aiError: string | null;
  createdAt: string;
};

export type CreateTicketResponse = {
  ticket: Ticket;
  triage: {
    status: "success" | "failed";
    warning?: string;
  };
};

function apiBase() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
}

export async function createTicket(input: {
  name: string;
  email: string;
  message: string;
}): Promise<CreateTicketResponse> {
  const res = await fetch(`${apiBase()}/api/tickets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Failed to submit ticket"
    );
  }

  return data as CreateTicketResponse;
}
