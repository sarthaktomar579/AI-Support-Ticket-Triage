const {
  createTicket,
  findTickets,
  findTicketById,
} = require("../db/tickets");
const { toTicketResponse } = require("../utils/serialize");
const { triageTicket } = require("../services/geminiTriage");

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PRIORITIES = new Set(["Low", "Medium", "High"]);
const CATEGORIES = new Set(["Billing", "Bug", "Feature Request", "Other"]);

async function create(req, res, next) {
  try {
    const name = typeof req.body.name === "string" ? req.body.name.trim() : "";
    const email =
      typeof req.body.email === "string" ? req.body.email.trim() : "";
    const message =
      typeof req.body.message === "string" ? req.body.message.trim() : "";

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "name, email, and message are required" });
    }

    if (!EMAIL_RE.test(email)) {
      return res.status(400).json({ error: "email is invalid" });
    }

    const triage = await triageTicket({ name, email, message });

    const ticket = await createTicket({
      name,
      email,
      message,
      priority: triage.priority,
      category: triage.category,
      suggestedReply: triage.suggestedReply,
      aiStatus: triage.ok ? "success" : "failed",
      aiError: triage.ok ? null : triage.error,
    });

    return res.status(201).json({
      ticket: toTicketResponse(ticket),
      triage: {
        status: triage.ok ? "success" : "failed",
        ...(triage.ok
          ? {}
          : { warning: "Automated triage used a mock reply." }),
      },
    });
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const priority =
      typeof req.query.priority === "string" ? req.query.priority : undefined;
    const category =
      typeof req.query.category === "string" ? req.query.category : undefined;

    if (priority && !PRIORITIES.has(priority)) {
      return res
        .status(400)
        .json({ error: "priority must be Low, Medium, or High" });
    }

    if (category && !CATEGORIES.has(category)) {
      return res.status(400).json({
        error: "category must be Billing, Bug, Feature Request, or Other",
      });
    }

    const tickets = await findTickets({ priority, category });
    return res.status(200).json({
      tickets: tickets.map(toTicketResponse),
    });
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "invalid ticket id" });
    }

    const ticket = await findTicketById(id);
    if (!ticket) {
      return res.status(404).json({ error: "ticket not found" });
    }

    return res.status(200).json({ ticket: toTicketResponse(ticket) });
  } catch (err) {
    return next(err);
  }
}

module.exports = { create, list, getById };
