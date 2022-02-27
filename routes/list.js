const express = require("express");
const router = express.Router();

const List = require("../models/list");
const verify = require("../verifyAccessToken");


router.post("/", verify, async (req, res) => {
    
    if(req.user.isAdmin){

        const newList = new List(req.body);

        try{

            const listMovie = await newList.save();

            res.status(200).send(listMovie);
        }catch(err){
            res.status(500).send(err);
        }
    }else {
        res.status(403).send("Forbidden!!!Not allowed to perform this action.");
    }
})

router.put("/:id", verify, async (req, res) => {

  if(req.user.isAdmin){

      try {

          const updatedList = await List.findByIdAndUpdate(req.params.id, { $set: req.body, }, {new: true})
          res.status(200).send(updatedList);
      }
      catch(err){
          res.status(500).send(err);
      }
  } else{
      res.status(403).send("Forbidden!!!Not allowed to perform this action.");
  }

})


router.delete("/:id", verify, async (req, res) =>{

    if(req.user.isAdmin) {

        try{

            await List.findByIdAndDelete(req.params.id);

            res.status(200).send("List is deleted");

        }catch(err){
            res.status(500).send(err);
        }
    }else{
        res.status(403).send("Forbidden!!!Not allowed to perform this action.");
    }
})


router.get("/", verify, async (req, res) => {

    const typeQuery = req.query.type;
    const genreQuery = req.query.genre;

    let list = [];

    try {
      if (typeQuery) {
        if (genreQuery) {

          list = await List.aggregate([
            { $sample: { size: 10 } },
            { $match: { type: typeQuery, genre: genreQuery } },
          ]);

        } 
        else {

          list = await List.aggregate([
            { $sample: { size: 10 } },
            { $match: { type: typeQuery } },
          ]);
          
        }
      } else {
        list = await List.aggregate([{ $sample: { size: 10 } }]);
      }

      res.status(200).json(list);

    } catch (err) {
      res.status(500).json(err);
    }
});

module.exports = router;