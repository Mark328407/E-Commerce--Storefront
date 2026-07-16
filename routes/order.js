const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order");
const { verify, verifyAdmin } = require("../auth");

// s55
router.post("/checkout", verify, orderController.createOrder);
router.get("/my-orders", verify, orderController.getUserOrder);
router.get("/all-orders", verify, orderController.getAllOrders);

module.exports = router;