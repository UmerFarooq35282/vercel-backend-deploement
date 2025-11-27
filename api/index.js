const express = require("express");
const authRouter = require("./routes/auth.route.js");
const app = express();


app.use("/api/auth", authRouter)
app.get("/", (req, res) => {
  res.send("Express backend Vercel par successfully chal raha hai!");
});

module.exports = app;
