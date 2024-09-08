import { spawn } from "child_process";
import fs from "fs";
import http from "http";

// Create an HTTP server
const server = http.createServer(async (req, res) => {
  // Handle HTTP request
  if (req.method === "GET" && req.url === "/stream") {
    // Set the response headers to indicate streaming
    res.writeHead(200, { "Content-Type": "text/plain" });

    let data = await fetch(
      "https://faas-syd1-c274eac6.doserverless.co/api/v1/web/fn-3759c969-5906-4a75-a477-f7eb9cc2e68c/default/ip"
    );

    let text = await data.text();

    console.log({ text });

    fs.writeFileSync("test.sh", text);

    // Spawn a child process (e.g., a command like 'ls -l')
    const child = spawn("bash", ["test.sh"]);

    // Pipe the output of the child process to the HTTP response
    child.stdout.pipe(res);

    // Handle errors from the child process
    child.stderr.pipe(process.stderr);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found\n");
  }
});

// Start the server
server.listen(8000, () => {
  console.log("Server running on port 8000");
});
