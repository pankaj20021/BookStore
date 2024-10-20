const router = require("express").Router();
const User = require("../models/user");
const authenticateToken = require("./userAuth");


//add book to favourite
router.put("/add-book-to-favourite",authenticateToken, async(req,res)=>{
    try {
        const { bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);
        if(isBookFavourite){
            return res.status(200).json({message:"Book already in  Favourites "});
        }
        await User.findByIdAndUpdate(id, {$push: { favourites:bookid }});
        return res.status(200).json({message:"Book added into  Favourites "});   
    } catch (error) {
        console.error(" show error ", error);
        return res.status(500).json({ message: "internal sever error" });
    }
});


//book delete/ update book from database of favourite api

router.put("/remove-book-from-favourite",authenticateToken, async(req,res)=>{
    try {
        const { bookid, id} = req.headers;
        const userData = await User.findById(id);
        const isBookFavourite = userData.favourites.includes(bookid);
        if(isBookFavourite){
            await User.findByIdAndUpdate(id, {$pull: { favourites:bookid }});
        }
       
        return res.status(200).json({message:"Book remove from  Favourites "});   
    } catch (error) {
        console.error(" show error ", error);
        return res.status(500).json({ message: "internal sever error" });
    }
});


// get Favourite book of particular user
router.get("/get-favourite-books", authenticateToken ,async(req,res)=>{
    try {
        const { id } = req.headers;
        const userData = await User.findById(id).populate("favourites");
        const favouriteBooks = userData.favourites;
        return res.json({
            status: "success",
            data: favouriteBooks,
        })

    } catch (error) {
        console.error(" show error ", error);
        return res.status(500).json({ message: "internal sever error" });
    }
});



module.exports = router;