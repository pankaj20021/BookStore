const router = require("express").Router();
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const Book = require("../models/book");
const authenticateToken = require("./userAuth");

// add book in --admin 
router.post("/add-book", authenticateToken, async (req, res) => {
    try {
        const { id } = req.headers;
        const user = await User.findById(id);
        if (user.role !== "admin") {
            return res.status(400).json({ message: " you are not access to perform admin" })
        }
        //new book api created 
        const newbook = new Book({
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language
        });
        await newbook.save();
        return res.status(200).json({ message: "Book is added  successfully " });
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "internal server error " });
    }
});


//update book api created
router.put("/update-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndUpdate(bookid, {
            url: req.body.url,
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
            desc: req.body.desc,
            language: req.body.language
        })

        return res.status(200).json({ message: "Book update successfully " });
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).json({ message: "internal server error " });
    }
});

//delete book api
router.delete("/delete-book", authenticateToken, async (req, res) => {
    try {
        const { bookid } = req.headers;
        await Book.findByIdAndDelete(bookid);
        return res.status(200).json({ message: " Book deleted successfully" });
    } catch (error) {
        console.error(" show error ", error);
        return res.status(500).json({ message: "internal sever error" });
    }
});

// get all books api created here 
router.get("/get-all-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 });

        if (books.length === 0) {
            return res.status(404).json({ message: "No books found" });
        }
        return res.json({
            status: "success",
            data: books,
        });
    } catch (error) {
        console.error(" show error ", error);
        return res.status(500).json({ message: "internal sever error" });
    }
});

//get recently added books limits 4
router.get("/get-recent-books", async (req, res) => {
    try {
        const books = await Book.find().sort({ createdAt: -1 }).limit(4);
        return res.json({
            status: "success",
            data: books,
        });

    } catch (error) {
        console.error(" show error ", error);
        return res.status(500).json({ message: "internal sever error" });

    }


});

//get all details of book api created
router.get("/get-book-by-id/:id", async (req, res) => {
    try {
      const {id } = req.params;
      const book = await Book.findById(id);
        return res.json({
            status: "success",
            data: book,
        });

    } catch (error) {
        console.error(" show error ", error);
        return res.status(500).json({ message: "internal sever error" });

    }


});

module.exports = router;