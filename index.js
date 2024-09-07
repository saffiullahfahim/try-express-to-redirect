import express from "express";
import cors from "cors";
const app = express();
// core
app.use(cors());

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.json({
    data: process.versions
  })
});
