const express = require("express");

const app  = express();

app.get("/", (req, res) => {
  res.redirect(req.query.link)
  res.json(req.query)
})

app.listen("5000", () => {
  console.log("http://127.0.0.1:5000")
})

