const express = require("express");
const ticketsController = require("../controllers/ticketsController");
const { requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/", ticketsController.create);
router.get("/", requireAdmin, ticketsController.list);
router.get("/:id", requireAdmin, ticketsController.getById);

module.exports = router;
