const express = require("express");
const app = express();
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");
const jwt = require("jsonwebtoken");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("common"));
app.use(helmet());

const auth = require("./api/auth");

const myposts = require("./api/myposts");
const users = require("./api/users");
const mycomments = require("./api/mycomments");
const mylikes = require("./api/mylikes");
const posts = require("./api/posts");
const follower = require("./api/follower");
app.use(
  cors({
    origin: "https://pipersocial.netlify.app",
    methods: ["GET", "PUT", "POST", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
const verifytoken = async (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const jwttoken = req.headers.authorization.split(" ")[1];
      const payload = await jwt.verify(jwttoken, process.env.SECRET_KEY);
      if (payload) {
        req.user_id = payload.userid;
        req.name = payload.name;
        return next();
      }
    } else {
      res.status(401);
      const error = new Error("No Token provided");
      return next(error);
    }
  } catch (error) {
    res.status(403);
    next(error);
  }
};

app.use("/api/auth", auth);

app.use("/api/posts", verifytoken, posts);
app.use("/api/users", verifytoken, users);
app.use("/api/me/users", verifytoken, follower);
app.use("/api/me", verifytoken, myposts); //posts
app.use("/api/me", verifytoken, mycomments); //comments
app.use("/api/me", verifytoken, mylikes); //likes
app.use((req, res, next) => {
  const error = new Error(`${req.url} not found `);
  res.status(400); //bad request
  return next(error);
});

//send error status code and errors messages
app.use((error, req, res, next) => {
  res.json({ message: error.message, name: error.name });
});

app.listen(process.env.PORT || 8080);
