const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const listRouter = require("./routes/list");
const movieRouter = require("./routes/movie");

const db = require("./mongoose");

app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/lists", listRouter);
app.use("/movies", movieRouter);

app.listen(process.env.PORT || 3001,()=>console.log("server running at port 3001"));
