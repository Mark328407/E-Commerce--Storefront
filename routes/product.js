const express = require('express');
const productController = require('../controllers/product');
const { verify, verifyAdmin } = require("../auth");
const router = express.Router();


router.post("/", verify, verifyAdmin, productController.createProduct);
router.get("/all", verify, verifyAdmin, productController.getAllProduct);
router.get("/active", productController.getAllActiveProduct);
router.get("/:productId", productController.getProduct);
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);
router.delete("/:productId/delete", verify, verifyAdmin, productController.deleteProduct);


router.post("/search-by-name", productController.searchByName);
router.post("/search-by-price", productController.searchByPrice);




module.exports = router;