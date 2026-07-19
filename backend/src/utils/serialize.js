function toTicketResponse(row) {
  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    email: row.email,
    message: row.message,
    priority: row.priority,
    category: row.category,
    suggestedReply: row.suggested_reply,
    aiStatus: row.ai_status,
    aiError: row.ai_error,
    createdAt: row.created_at,
  };
}

module.exports = { toTicketResponse };
