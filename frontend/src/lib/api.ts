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

export type LoginResponse = {
  token: string;
  admin: { id: number; email: string };
};

function apiBase() {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
}

async function parseError(res: Response) {
  const data = await res.json().catch(() => ({}));
  return typeof data.error === "string" ? data.error : `Request failed (${res.status})`;
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

  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as CreateTicketResponse;
}

export async function loginAdmin(input: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const res = await fetch(`${apiBase()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as LoginResponse;
}

export async function listTickets(
  token: string,
  filters: { priority?: string; category?: string } = {}
): Promise<Ticket[]> {
  const params = new URLSearchParams();
  if (filters.priority) params.set("priority", filters.priority);
  if (filters.category) params.set("category", filters.category);

  const query = params.toString();
  const res = await fetch(
    `${apiBase()}/api/tickets${query ? `?${query}` : ""}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error("UNAUTHORIZED");
    }
    throw new Error(await parseError(res));
  }
  const data = (await res.json()) as { tickets: Ticket[] };
  return data.tickets;
}
