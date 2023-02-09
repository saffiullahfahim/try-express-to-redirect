import fetch from "isomorphic-fetch";
globalThis.fetch = fetch;

import express from "express";
import cors from "cors";
import { config } from "dotenv";
import { ChatGPTAPI } from "./chatgpt.js";

const app = express();
config();
// core
app.use(cors());

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;

app.get(["/", "/wow/:name"], (req, res) => {
  let greeting = "<h1>Hello From Node on Render!</h1>";
  let name_ = req.params["name"];
  if (name_) {
    res.send(greeting + "</br>and hello to " + name_);
  } else {
    res.send(greeting);
  }
});

app.get("/versions", (req, res) => {
  res.json(process.versions);
});

app.get("/ip", (req, res) => {
  fetch("https://checkip.amazonaws.com/")
    .then((response) => response.text())
    .then((data) => res.send(data));
});

let conversationId, parentMessageId;


app.post("/send", async (req, res) => {
  try {
    const api = new ChatGPTAPI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log(req.body);

    res.send(req.body);

    const res_ = await api.sendMessage(req.body.text, {
      conversationId,
      parentMessageId,
      timeoutMs: 2 * 60 * 1000
    });
    conversationId = res_.conversationId;
    parentMessageId = res_.id;
    console.log(res_);

    let res__ = await (
      await fetch(req.body.response_url, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          replace_original: "true",
          text: res_.text,
        }),
      })
    ).text();

    console.log(res__);
  } catch (err) {
    fetch(req.body.response_url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        replace_original: "true",
        text: { err },
      }),
    })
      .then((r) => r.text())
      .then((re) => console.log(re))
      .catch((e) => console.log(e));
    // res.send(JSON.stringify({ err }));
  }
});

app.listen(port, () => console.log(`HelloNode app listening on port ${port}!`));
