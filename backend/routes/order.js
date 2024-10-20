const router = require("express").Router();
const authenticateToken = require("./userAuth");
const Book = require("../models/book");
const Order = require("../models/order");
const User = require("../models/user");


router.post("/placed-order", authenticateToken, async(req,res)=>{
    try {
        const {id} = req.headers;
        const {order} = req.body;

        for(const orderData of order) {
            const newOrder = new Order({ user: id, 
            book:orderData._id
        });
            const orderDataFromDb = await newOrder.save();
            // saving order in user model

            await User.findByIdAndUpdate(id,{
                $push:{orders: orderDataFromDb._id}
            });

            // clearing cart 
            await User.findByIdAndUpdate(id,{
                $pull:{cart: orderData._id}
            });

        } 
        return res.json({
            status: "success ",
            message: " order placed successfully"
        });
    } catch (error) { 
        console.error(" show error ", error);
        return res.status(500).json({ message: "internal sever error" });
    }
});

// get order history of particular user 

router.get("/get-order-history", authenticateToken, async (req, res) => {
    try {
        // Access the user ID from headers
        const userId = req.headers['id'];

        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        // Fetch user data and populate orders and books
        const userData = await User.findById(userId).populate({
            path: 'orders',
            populate: {
                path: 'book'
            }
        });

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        // Reverse the orders array
        const orderData = userData.orders.reverse();

        // Respond with the order data
        return res.json({
            status: "success",
            data: orderData
        });
    } catch (error) {
        console.error("Error fetching order history:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});


// get all order  ---admin 
router.get("/get-all-order-admin", authenticateToken,async(req,res)=>{
    try {
        const userData = await Order.find().papulate({
            path: "book",

        }).populate({
            path:"user",
        }).sort({createdAt: -1 });
        return res.json({
            status: " success",
            data: userData ,
        })
    } catch (error) {
        console.error(" show error ", error);
        return res.status(500).json({ message: "internal sever error" });
    }
});
//update order ---admin

router.put("/update-status-admin", authenticateToken,async(req,res)=>{
    try {
        const {id} = req.params;
        await Order.findByIdAndUpdate(id, {status: req.body.status});
        return res.json({
            status: "Success",
            message: "staus upadte successFully",
        });
    } catch (error) {
        console.error(" show error ", error);
        return res.status(500).json({ message: "internal sever error" });
    }
});

module.exports = router;