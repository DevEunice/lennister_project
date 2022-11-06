const express = require('express');
const router = express.Router();
const feeController = require("../controller/feeController")

/* GET users listing. */
// router.get('/fees', feeController.getFsc);
router.post('/fees', feeController.feeConfiguration);
router.post('/compute-transaction-fee', feeController.feeComputation);

module.exports = router;
