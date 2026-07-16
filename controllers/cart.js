const Cart = require("../models/Cart");
const { errorHandler } = require("../auth");

//s53
module.exports.getCart = (req, res) => {

    if (req.user.isAdmin) {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        });
    }

    return Cart.findOne({ userId: req.user.id })
    .then(cart => {

        if (!cart) {
            return res.status(404).send({
                message: "Cart not found"
            });
        }

        return res.status(200).send({ cart: cart });

    })
    .catch(error => errorHandler(error, req, res));
};


const Product = require("../models/Product");

module.exports.addToCart = (req, res) => {
    if (req.user.isAdmin) {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        });
    }

    const { productId, quantity } = req.body;

    return Product.findById(productId)
    .then(product => {
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        const subtotal = product.price * quantity;

        return Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) {
                let newCart = new Cart({
                    userId: req.user.id,
                    cartItems: [{ productId, quantity, subtotal }],
                    totalPrice: subtotal
                });

                return newCart.save()
                .then(savedCart => res.status(200).send({
                    message: "Item added to cart successfully",
                    cart: savedCart
                }));
            }

            let itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

            if (itemIndex !== -1) {
                cart.cartItems[itemIndex].quantity = quantity;
                cart.cartItems[itemIndex].subtotal = subtotal;
            } else {
                cart.cartItems.push({ productId, quantity, subtotal });
            }

            cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

            return cart.save()
            .then(updatedCart => res.status(200).send({
                message: "Item added to cart successfully",
                cart: updatedCart
            }));
        });
    })
    .catch(error => errorHandler(error, req, res));
};


module.exports.updateCartQuantity = (req, res) => {

    if (req.user.isAdmin) {
        return res.status(403).send({
            auth: "Failed",
            message: "Action Forbidden"
        });
    }

    const { productId, newQuantity } = req.body;

    return Cart.findOne({ userId: req.user.id })
    .then(cart => {

        if (!cart) {
            return res.status(404).send({
                message: "Cart not found"
            });
        }

        let itemIndex = cart.cartItems.findIndex(item => item.productId.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).send({
                message: "Item not found in cart"
            });
        }

        let currentItem = cart.cartItems[itemIndex];
        let unitPrice = currentItem.subtotal / currentItem.quantity;

        currentItem.quantity = newQuantity;
        currentItem.subtotal = unitPrice * newQuantity;

        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        return cart.save()
        .then(updatedCart => {
            return res.status(200).send({
                message: "Item quantity updated successfully",
                updatedCart: updatedCart
            });
        })
        .catch(error => errorHandler(error, req, res));

    })
    .catch(error => errorHandler(error, req, res));
};

 //s54
module.exports.removeFromCart = (req, res) => {

    const userId = req.user.id;
    const productId = req.params.productId;

    Cart.findOne({ userId: userId })
    .then(cart => {

        // Step 4: If no cart found
        if (!cart) {
            return res.status(404).send({
                message: "No cart found for this user"
            });
        }

        // Step 5: Check if product exists
        const productIndex = cart.cartItems.findIndex(
            item => item.productId.toString() === productId
        );

        if (productIndex === -1) {
            return res.status(404).send({
                message: "Product not found in cart"
            });
        }

        // Step 5a: Remove product
        const removedItem = cart.cartItems[productIndex];

        cart.totalPrice -= removedItem.subtotal;

        cart.cartItems.splice(productIndex, 1);

        // Step 6: Save cart
        return cart.save()
        .then(updatedCart => {

            // Step 6a: Send updated cart
            return res.status(200).send({
                message: "Item removed from cart successfully",
                cart: updatedCart
            });

        })
        .catch(error => {

            // Step 6b: Catch save error
            return res.status(500).send({
                message: "Error saving cart",
                error: error.message
            });

        });

    })
    .catch(error => {

        // Step 7: Catch find error
        return res.status(500).send({
            message: "Error finding cart",
            error: error.message
        });

    });
};

module.exports.clearCart = (req, res) => {

    const userId = req.user.id;

    // Step 3: Find the cart of the user
    Cart.findOne({ userId: userId })
    .then(cart => {

        // Step 4: If no cart found
        if(!cart){
            return res.status(404).send({
                message: "No cart found for this user"
            });
        }

        // Step 5: Check if cart has items
        if(cart.cartItems.length === 0){
            return res.status(400).send({
                message: "Cart is already empty"
            });
        }

        // Step 5a: Remove all items
        cart.cartItems = [];
        cart.totalPrice = 0;

        // Step 6: Save cart
        return cart.save()
        .then(updatedCart => {

            // Step 6a: Send response
            return res.status(200).send({
                message: "Cart cleared successfully",
                cart: updatedCart
            });

        })
        .catch(error => {

            // Step 6b: Catch save error
            return res.status(500).send({
                message: "Error saving cart",
                error: error.message
            });

        });

    })
    .catch(error => {

        // Step 7: Catch find error
        return res.status(500).send({
            message: "Error finding cart",
            error: error.message
        });

    });
};

