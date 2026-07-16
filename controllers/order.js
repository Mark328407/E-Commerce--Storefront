const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { errorHandler } = require("../auth");

//s 55
module.exports.createOrder = (req, res) => {

    const userId = req.user.id;

    // Step 2: Ensure the user is NOT an admin
    if (req.user.isAdmin) {
        return res.status(403).send({
            message: "Admin users cannot place orders"
        });
    }

    // Step 3: Find the cart of the user
    Cart.findOne({ userId: userId })
    .then(cart => {

        // Step 4: If no cart found
        if (!cart) {
            return res.status(404).send({
                message: "Cart not found"
            });
        }

        // Step 5: Check if the cart has items
        if (cart.cartItems.length === 0) {
            return res.status(400).send({
                message: "Cart is empty"
            });
        }

        // Step 5a: Create a new order
        const newOrder = new Order({
            userId: userId,
            productsOrdered: cart.cartItems,
            totalPrice: cart.totalPrice
        });

        // Step 6: Save the order
        return newOrder.save()
        .then(order => {

            return res.status(201).send({
                message: "Order created successfully",
                order: order
            });

        })
        .catch(error => {

            // Step 6b: Catch error while saving
            return res.status(500).send({
                message: "Error saving order",
                error: error.message
            });

        });

    })
    .catch(error => {

        // Step 7: Catch error while finding cart
        return res.status(500).send({
            message: "Error finding cart",
            error: error.message
        });

    });

};


module.exports.getUserOrder = (req, res) => {

    const userId = req.user.id;

    // Step 1 & 2: Ensure the user is authenticated and NOT an admin
    if(req.user.isAdmin){
        return res.status(403).send({
            message: "Admin users are not allowed to access this resource"
        });
    }

    // Step 3: Find the orders of the user
    Order.find({ userId: userId })
    .then(orders => {

        // Step 4: If no orders found
        if(!orders || orders.length === 0){
            return res.status(404).send({
                message: "No orders found for this user"
            });
        }

        // Step 5: Send the found orders
        return res.status(200).send({
            orders: orders
        });

    })
    .catch(error => {

        // Step 6: Catch error
        return res.status(500).send({
            message: "Error retrieving orders",
            error: error.message
        });

    });

};


module.exports.getAllOrders = (req, res) => {

    // Step 1 & 2: Ensure the user is authenticated and is an admin
    if(!req.user.isAdmin){
        return res.status(403).send({
            message: "Access denied. Admin privileges required."
        });
    }

    // Step 3: Find all orders
    Order.find({})
    .then(orders => {

        // Step 4: Send all orders
        return res.status(200).send({
            orders: orders
        });

    })
    .catch(error => {

        // Step 5: Catch error
        return res.status(500).send({
            message: "Error retrieving orders",
            error: error.message
        });

    });

};