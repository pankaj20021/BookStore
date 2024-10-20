const router = require("express").Router();
const User = require("../models/user");
const authenticateToken = require("./userAuth");

// put book into the cart
router.put("/add-book-cart", authenticateToken, async (req, res) => {
    try {
        const { bookid, id } = req.headers;
        const userData = await User.findById(id);
        const isBookInCart = userData.cart.includes(bookid);
        if (isBookInCart) {
            return res.json({
                status: "success",
                message: "Book already in the cart ",
            });
        }
        await User.findByIdAndUpdate(id, {
         $push: { cart: bookid } });

        return res.json({
            status: "success",
            message: "Book added to cart ",
        });
    } catch (error) {
        console.error(" show error ", error);
        return res.status(500).json({ message: "internal sever error" });
    }
});


// delete/ update book from cart api
router.put("/remove-book-from-cart/:bookid",authenticateToken, async(req,res)=>{
    try {
        const { bookid} = req.params;
        const {id} = req.headers;
       await User.findByIdAndUpdate(id, {
        $pull: { cart: bookid } });
        return res.json({
            status: "success",
            message: "Book removed from cart ",
        });

    } catch (error) {
        console.error(" show error ", error);
        return res.status(500).json({ message: "internal sever error" });
    }
});


//get a cart of particular user 

router.get("/get-user-cart",authenticateToken, async(req,res)=>{
    try {
       
        const { id } = req.headers;
        const userData = await User.findById(id).populate("cart");;
        const cart = userData.cart.reverse();

        return res.json({
            status: "success",
            data: cart,
        })

    } catch (error) {
        console.error(" show error ", error);
        return res.status(500).json({ message: "internal sever error" });
    }
});
module.exports = router;
