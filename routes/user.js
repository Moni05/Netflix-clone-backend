const express = require("express");
const router = express.Router();

const User = require("../models/user");
const verify = require("../verifyAccessToken");


router.get("/find/:id", async (req, res) => {

    try {
        const user = await User.findById(req.params.id);
        const { password, ...userInfo } = user._doc;

        res.status(200).send(userInfo);
    } 
    catch (err) {
        
        res.status(500).send(err);
    }

})

router.put("/:id", verify, async (req, res) => {

    if(req.user.id === req.params.id || req.user.isAdmin){
        if(req.body.password) {
            req.body.password = CryptoJS.AES.encrypt(
              req.body.password,
              process.env.SECRET_KEY
            ).toString();
        }

        try {

            const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: req.body, }, {new: true})

            res.status(200).send(updatedUser);
        }
        catch(err){
            res.status(500).send(err);
        }
    } else{
        res.status(403).send("Access Denied");
    }

})

router.delete("/:id", verify, async (req, res) =>{

    if(req.user.id === req.params.id || req.user.isAdmin) {

        try{

            await User.findByIdAndDelete(req.params.id);

            res.status(200).send("User is deleted");

        }catch(err){
            res.status(500).send(err);
        }
    }else{
        res.status(403).send("Not authorised to perform this action");
    }
})

router.get("/", verify, async (req, res) => {

  const query = req.query.new;

  if (req.user.isAdmin) {

    try {
          
        const users = query
        ? await User.find().sort({ _id: -1 }).limit(5)
        : await User.find();

        res.status(200).json(users);

    } 

    catch (err) {
      res.status(500).send(err);
    }

  } 
  else {
    res.status(403).send("You are not allowed to see all users!");
  }

})


router.get("/stats", async (req, res) => {

    const today = new Date();
    const latYear = today.setFullYear(today.setFullYear() - 1);
  
    try {
      const data = await User.aggregate([
        {
          $project: {
            month: { $month: "$createdAt" },
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: 1 },
          },
        },
      ]);

      res.status(200).json(data)
    } 
    
    catch (err) {
      res.status(500).json(err);
    }

})

module.exports = router;