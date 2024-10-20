const express = require("express");
const app = express();
const cors = require('cors');
require("dotenv").config();
require('./connection/connection');
const User = require("./routes/user"); // this user take from ROUTES folder
const Bookdata = require("./routes/book");
const favourite = require("./routes/favourite");
const cart = require("./routes/cart");
const OrderAPi = require("./routes/order");
app.use(cors());
app.use(express.json());


//routes
app.use("/api/v1",User);
app.use("/api/v1",Bookdata);  
app.use("/api/v1",favourite);
app.use("/api/v1",cart);
app.use("/api/v1",OrderAPi);

// creating port 
app.listen(process.env.PORT,() =>{
    console.log(`server is started at ${process.env.PORT}`);
})

