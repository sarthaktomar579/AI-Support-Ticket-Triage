const express = require("express");
const ticketsController = require("../controllers/ticketsController");

const router = express.Router();

router.post("/", ticketsController.create);
router.get("/", ticketsController.list);
router.get("/:id", ticketsController.getById);

module.exports = router;
