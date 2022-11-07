const express = require("express");
const router = express.Router();
const feeController = require("../controller/feeController");

router.post("/fees", feeController.feeConfiguration);
router.post("/compute-transaction-fee", feeController.feeComputation);

module.exports = router;
