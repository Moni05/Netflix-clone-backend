const express = require("express");
const router = express.Router();
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

router.post("/register", async (req, res) =>{

    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.SECRET_KEY).toString(),
    });

    try{
        const user = await newUser.save();
        res.json("User created");
    }
    catch(err){
        console.log(err);
        
        let message = "Unable to create new user at the moment, Please try again or contact administrator!";
        if (err.message.includes("duplicate key error collection")) {
            message = `User with the same mail or username already exist or the email is invalid`;
        }
        res.json(message);
    }
})

router.post("/login", async (req, res) =>{

    try{

        const user = await User.findOne({ email: req.body.email });

        //!user && res.status(401).json("Email or Password is incorrect");

        if(!user) return res.status(401).json("Email or Password is incorrect");

        const keys = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPassword = keys.toString(CryptoJS.enc.Utf8);

        if(originalPassword !== req.body.password) return res.status(401).json("Email or Password is incorrect");

        const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_TOKEN, { expiresIn: "1d" },
        )

        const { password, ...userInfo } = user._doc;

        res.status(200).json({ ...userInfo, accessToken });
    }
    catch(err){
        res.status(500).json(err);
    }
})

module.exports = router;