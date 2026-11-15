// File-based storage using fs + path modules, EventEmitter for notifications.
const fs = require("fs");
const path = require("path");
const EventEmitter = require("events");

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "registrations.json");
const LOG_FILE = path.join(DATA_DIR, "activity.log");

class EventStore extends EventEmitter {
  constructor() {
    super();
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
    if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]");
  }

  async readAll() {
    const raw = await fs.promises.readFile(DATA_FILE, "utf8");
    return JSON.parse(raw || "[]");
  }

  async writeAll(list) {
    await fs.promises.writeFile(DATA_FILE, JSON.stringify(list, null, 2));
  }

  async add({ name, email, event, department, year }) {
    const list = await this.readAll();
    if (list.some((r) => r.email === email && r.event === event))
      throw new Error("Duplicate registration for this event");
    const record = {
      id: list.length ? Math.max(...list.map((r) => r.id)) + 1 : 1,
      name, email, event, department, year,
      createdAt: new Date().toISOString(),
    };
    list.push(record);
    await this.writeAll(list);
    this.emit("registered", record);          // EventEmitter notification
    return record;
  }

  async remove(id) {
    const list = await this.readAll();
    const idx = list.findIndex((r) => r.id === id);
    if (idx === -1) return null;
    const [removed] = list.splice(idx, 1);
    await this.writeAll(list);
    this.emit("removed", removed);
    return removed;
  }

  // Streams: write activity log using a writable stream
  createLogStream() {
    return fs.createWriteStream(LOG_FILE, { flags: "a" });
  }

  // Streams: read the activity log as a readable stream
  readLogStream() {
    if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, "");
    return fs.createReadStream(LOG_FILE, { encoding: "utf8" });
  }
}

module.exports = new EventStore();
