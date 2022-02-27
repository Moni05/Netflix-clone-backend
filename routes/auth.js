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
        res.status(200).send(user);
    }
    catch(err){
        res.status(500).send(err);
    }
})

router.post("/login", async (req, res) =>{

    try{

        const user = await User.findOne({ email: req.body.email });

        !user && res.status(401).send("Email or Password is incorrect");

        const keys = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY);
        const originalPassword = keys.toString(CryptoJS.enc.Utf8);

        originalPassword !== req.body.password && res.status(401).send("Email or Password is incorrect");

        const accessToken = jwt.sign(
            { id: user._id, isAdmin: user.isAdmin }, process.env.SECRET_TOKEN, { expiresIn: "1d" },
        )

        const { password, ...userInfo } = user._doc;

        res.status(200).send({ ...userInfo, accessToken });
    }
    catch(err){
        res.status(500).send(err);
    }
})

module.exports = router;