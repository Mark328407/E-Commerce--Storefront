const express = require("express");
const cartController = require("../controllers/cart");
const { verify } = require("../auth");

const router = express.Router();

//s53
router.get("/get-cart", verify, cartController.getCart);
router.post("/add-to-cart", verify, cartController.addToCart);
router.patch("/update-cart-quantity", verify, cartController.updateCartQuantity);
//s54
router.patch("/:productId/remove-from-cart", verify, cartController.removeFromCart);
router.put("/clear-cart", verify, cartController.clearCart);


module.exports = router;