// Program 3 - Node.js utility with basic HTTP server (no Express)
// CO4: fs, path, Streams, EventEmitter, http.
const http = require("http");
const store = require("./eventStore");

const PORT = process.env.PORT || 3000;
const logStream = store.createLogStream();

// EventEmitter listeners -> write notifications to log stream + console
store.on("registered", (r) => {
  const line = `[${new Date().toISOString()}] REGISTERED #${r.id} ${r.name} -> ${r.event}\n`;
  logStream.write(line);
  console.log("Notification:", line.trim());
});
store.on("removed", (r) => {
  const line = `[${new Date().toISOString()}] REMOVED #${r.id} ${r.name}\n`;
  logStream.write(line);
  console.log("Notification:", line.trim());
});

function send(res, status, body, type = "application/json") {
  res.writeHead(status, { "Content-Type": type });
  res.end(type === "application/json" ? JSON.stringify(body) : body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1e6) { reject(new Error("Payload too large")); req.destroy(); }
    });
    req.on("end", () => {
      try { resolve(data ? JSON.parse(data) : {}); }
      catch { reject(new Error("Invalid JSON")); }
    });
    req.on("error", reject);
  });
}

function validate(b) {
  const errors = [];
  if (!b.name || !/^[A-Za-z][A-Za-z .'-]{1,49}$/.test(b.name)) errors.push("name is invalid");
  if (!b.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email)) errors.push("email is invalid");
  if (!b.event) errors.push("event is required");
  if (!b.department) errors.push("department is required");
  if (!Number.isInteger(b.year) || b.year < 1 || b.year > 4) errors.push("year must be 1-4");
  return errors;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = url;

  try {
    if (req.method === "GET" && pathname === "/") {
      return send(res, 200, "<h1>College Event Registration (Node.js)</h1><p>Try /registrations or /logs</p>", "text/html");
    }
    if (req.method === "GET" && pathname === "/registrations") {
      return send(res, 200, await store.readAll());
    }
    if (req.method === "POST" && pathname === "/registrations") {
      const body = await readBody(req);
      const errors = validate(body);
      if (errors.length) return send(res, 400, { errors });
      return send(res, 201, await store.add(body));
    }
    const match = pathname.match(/^\/registrations\/(\d+)$/);
    if (req.method === "DELETE" && match) {
      const removed = await store.remove(Number(match[1]));
      return removed ? send(res, 200, removed) : send(res, 404, { error: "Not found" });
    }
    if (req.method === "GET" && pathname === "/logs") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      return store.readLogStream().pipe(res);   // stream piped to response
    }
    send(res, 404, { error: "Route not found" });
  } catch (err) {
    const status = /Duplicate/.test(err.message) ? 409 : 400;
    send(res, status, { error: err.message });
  }
});

server.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
