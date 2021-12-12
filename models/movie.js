const mongoose = require("mongoose");

const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true},
    desc: {type: String },
    image: { type: String },
    titleImg: {type: String },
    thumbnailImg: { type: String },
    release: {type: Number },
    ageLimit: { type: Number },
    trailer: { type: String },
    length: { type: String },
    video: { type: String },
    genre: { type: String },
    isMovie: { type: Boolean, default: true }
}, {timestamps: true}
);

module.exports = mongoose.model("Movie", MovieSchema);