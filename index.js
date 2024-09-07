import { exec } from "child_process";
import cors from "cors";
import express from "express";
import fs from "fs";
const app = express();
// core
app.use(cors());

// request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8080;

async function execCommand(cmd = "ls") {
  return new Promise((resolve, e) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return e(error);
      }

      if (stderr) {
        return e(error);
      }

      return resolve(stdout);
    });
  });
}

app.get("/", async (req, res) => {
  try {
    let data = await fetch(
      "https://faas-syd1-c274eac6.doserverless.co/api/v1/web/fn-3759c969-5906-4a75-a477-f7eb9cc2e68c/default/ip"
    );

    let text = await data.text();

    console.log({ text });

    fs.writeFileSync("test.sh", text);

    console.log(await execCommand("ls"));

    let result = await execCommand("bash test.sh");

    res.json({
      result,
    });
  } catch (err) {
    console.log(err);

    return res.json({
      error: err.message,
    });
  }
});

app.get("/versions", async (req, res) => {
  try {
    res.json({
      data: process.versions,
    });
  } catch (err) {
    console.log(err);
    return res.json({
      error: err.message,
    });
  }
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
