
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const orderRoutes = require("./routes/order");


require('dotenv').config();


const app = express();

mongoose.connect(process.env.MONGODB_STRING);

let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => console.log('Now connected to MongoDB Atlas'));

const corsOption = {
  origin: [
    'http://localhost:8000',
    'http://zuitt-bootcamp-prod-599-9467-estrecho.s3-website.us-east-1.amazonaws.com',
    'https://capstone-3-beta.vercel.app'
    
  ],
  
  credentials: true,
  optionsSuccessStatus: 200
}


app.use(express.json());
app.use(cors(corsOption));

app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use('/orders', orderRoutes);


if(require.main === module) {
	// http:localhost:4000
	app.listen(process.env.PORT || 4000, () => console.log(`API is now online on port ${process.env.PORT || 4000}`)); 
};

module.exports = {app, mongoose};

