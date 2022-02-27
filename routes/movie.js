const express = require("express");
const router = express.Router();

const Movie = require("../models/movie");
const verify = require("../verifyAccessToken");


router.get("/find/:id", verify, async (req, res) => {

    try {
        const movie = await Movie.findById(req.params.id);

        res.status(200).send(movie);
    } 
    catch (err) {
        
        res.status(500).send(err);
    }

})

router.post("/", verify, async (req, res) => {
    if(req.user.isAdmin){

        const newMovie = new Movie(req.body);

        try{

            const savedMovie = await newMovie.save();

            res.status(200).send(savedMovie);
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

            const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, { $set: req.body, }, {new: true})

            res.status(200).send(updatedMovie);
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

            await Movie.findByIdAndDelete(req.params.id);

            res.status(200).send("Movie is deleted");

        }catch(err){
            res.status(500).send(err);
        }
    }else{
        res.status(403).send("Forbidden!!!Not allowed to perform this action.");
    }
})

router.get("/random", verify, async (req, res) => {

  const type = req.query.type;

  let movie;

  try{
    if(type === "movies"){

        movie = await Movie.aggregate([
            { $match: { isMovie: true } },
            { $sample: { size: 1} },
        ])
    } else {

        movie = await Movie.aggregate([
            { $match: { isMovie: false } },
            { $sample: { size: 1} },
        ])
    }

    res.status(200).send(movie);
  }
  catch(err){
      res.status(500).send(err);
  }

})


router.get("/", verify, async (req, res) => {
    
    if (req.user.isAdmin) {
        
        try {
            const movies = await Movie.find();
            res.status(200).send(movies.reverse());
        } 
        catch (err) {
            res.status(500).send(err);
        }
    } 
    
    else {
        res.status(403).send("Forbidden!!!Not allowed to perform this action.");
    }

})

module.exports = router;