const express = require("express");
const ticketsController = require("../controllers/ticketsController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

// Public: users submit tickets
router.post("/", ticketsController.create);

// Protected: admin dashboard reads
router.get("/", requireAdmin, ticketsController.list);
router.get("/:id", requireAdmin, ticketsController.getById);

module.exports = router;
