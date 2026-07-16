const Product = require("../models/Product");
const { errorHandler } = require("../auth");

module.exports.createProduct = (req, res) => {

    let newProduct = new Product({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price,
        image : req.body.image || ''
    });

    
    return Product.findOne({ name: req.body.name}).then(existingProduct => {

        
        if(existingProduct) {

        
            return res.status(409).send({ message:'Product already exists'});

       
        } else {

          
            return newProduct.save()
            .then(result => res.status(201).send({
                success: true,
                message: 'Product added successfully',
                result: result
            }))
        
            .catch(err => errorHandler(err, req, res));
        }
    })
    .catch(err => errorHandler(err, req, res));
};

module.exports.getAllProduct = (req, res) => {

    return Product.find({}).then(result => {
        if(result.length > 0){
            return res.status(200).send(result);
        }
        else{
            return res.status(404).send({ message: 'No Product found'});
        }
    })
    .catch(err => errorHandler(err, req, res));
};

module.exports.getAllActiveProduct = (req, res) => {

    Product.find({ isActive: true }).then(result => {
        if(result.length > 0){
            return res.status(200).send(result);
        }
        else{
            return res.status(404).send({message:'No active product found'});
        }
    })
    .catch(err => errorHandler(err, req, res));

};

module.exports.getProduct = (req, res) => {

    Product.findById(req.params.productId).then(Product => {
        if(Product) {
            return res.status(200).send(Product);
        } else {
            return res.status(404).send({message:'Product not found'});
        }
    })
    .catch(err => errorHandler(err, req, res));
    
};

module.exports.updateProduct = (req, res)=>{

    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image: req.body.image
    }

    return Product.findByIdAndUpdate(req.params.productId, updatedProduct)
    .then(Product => {
        if (Product) {
            return res.status(200).send({
                success: true,
                message: 'Product updated successfully' 
            });
        } else {
            return res.status(404).send({ message: 'Product not found' });
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.archiveProduct = (req, res) => {

    let updateActiveField = {
        isActive: false
    }

    return Product.findByIdAndUpdate(req.params.productId, updateActiveField).then(Product => {
        if (Product) {
            if (!Product.isActive) {
                return res.status(200).send({
                    message: 'Product already archived',
                    Product: Product});
            }

            return res.status(200).send({
                success: true,
                message: 'Product archived successfully'});
        } else {
            return res.status(404).send({ message: 'Product not found'});
        }
    })
    .catch(error => errorHandler(error, req, res));
};

module.exports.activateProduct = (req, res) => {

    return Product.findById(req.params.productId)
    .then(Product => {


        if (!Product) {
            return res.status(404).send({
                message: 'Product not found'
            });
        }


        if (Product.isActive) {
            return res.status(200).send({
                message: 'Product already activated',
                Product: Product
            });
        }


        Product.isActive = true;

        return Product.save().then(updatedProduct => {
            return res.status(200).send({
                success: true,
                message: 'Product activated successfully'
            });
        });

    })

    .catch(error => errorHandler(error, req, res));
};

module.exports.deleteProduct = (req, res) => {

    return Product.findByIdAndDelete(req.params.productId)
    .then(deletedProduct => {

        if (!deletedProduct) {
            return res.status(404).send({
                message: 'Product not found'
            });
        }

        return res.status(200).send({
            success: true,
            message: 'Product permanently deleted'
        });

    })
    .catch(error => errorHandler(error, req, res));
};

//s54
module.exports.searchByName = (req, res) => {

    const name = req.body.name;

    Product.find({ name: name })
    .then(result => {

        return res.status(200).send(result);

    })
    .catch(error => {

        return res.status(500).send({
            message: "Error finding product",
            error: error.message
        });

    });

};

module.exports.searchByPrice = (req, res) => {

    const { minPrice, maxPrice } = req.body;

    Product.find({
        price: { $gte: minPrice, $lte: maxPrice }
    })
    .then(products => {

        return res.status(200).send(products);

    })
    .catch(error => {

        return res.status(500).send({
            message: "Error finding products by price",
            error: error.message
        });

    });

};