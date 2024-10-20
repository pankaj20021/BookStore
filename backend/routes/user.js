const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./userAuth");


// sing-up
router.post("/sign-up", async (req, res) => {
    try {
        const { username, email, password, address } = req.body;

        // check username length is more than 3
        if (username.length < 4) {
            return res.status(400).json({ message: "username length should be greater than 3" });
        }
        // check username already exist 
        const ExistingUsername = await User.findOne({ username: username });
        if (ExistingUsername) {
            return res.status(400).json({ message: "username already exist" });
        }

        // check email already exist 
        const ExistingEmail = await User.findOne({ email: email });
        if (ExistingEmail) {
            return res.status(400).json({ message: "username already exist" });
        }

        // check password length 
        if (password.length < 5) {
            return res.status(400)
                  .json({ message: "password length should be greater than 5" });
        }
        //    bcrypt the password with hashMap 
        const hashPass = await bcrypt.hash(password, 10);
        //new user created
        const newUser = new User({
             username: username, 
             email: email,
             password: hashPass,
             address: address
             });
        await newUser.save();
        return res.status(200).json({ massage: "signUp successfully" });

    } catch (error) {
        console.error(" error in sign-up", error);
        return res.status(500).json({ massage: "Internal server error" });
    }
});


//sign-in 
router.post("/sign-in", async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (!existingUser) {
            return res.status(400).json({ message: "Invailid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (isPasswordValid) {
            const authClaims = [
                { name: existingUser.username }, { role: existingUser.role }
            ]
            const token = jwt.sign({ authClaims }, "books123", {
                expiresIn:"30d",

            });
            return res.status(200).json({ 
                 id: existingUser._id,
                 role: existingUser.role,
                 token: token 
                });

        } else {
            return res.status(400).json({ message: "Invailid credentials" });

        }
    } catch (error) {
        console.error(" error in sign-in", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//get user information 
router.get("/get-user-info",authenticateToken, async (req, res) =>{
    try {
        const {id} = req.headers;
        const data = await User.findById(id).select("-password"); //hide the password from db
        return res.status(200).json(data);
        
    } catch (error) {
        res.status(500).json({message:"internal s3erver error "});
    }
});

// update user address
router.put("/update-address",authenticateToken, async (req, res) =>{
    try {
        const {id} = req.headers;
        const { address } = req.body;
        await User.findByIdAndUpdate(id, {address : address});
        return res.status(200).json({message:" address update successfully"});

    } catch (error) {
        res.status(500).json({message:"internal server error "}); 
    }
});

module.exports = router; 