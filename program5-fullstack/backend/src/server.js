// Program 5 - Express + Sequelize (PostgreSQL) backend (CO6)
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize } = require("./models");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const allowed = (process.env.CORS_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);

app.use(cors({ origin: allowed.length ? allowed : false }));
app.use(express.json());
app.use((req, res, next) => { console.log(`${req.method} ${req.originalUrl}`); next(); });

app.get("/", (req, res) => res.json({ status: "ok", service: "College Event Registration API" }));
app.use("/api/registrations", require("./routes/registrations"));
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
sequelize
  .sync()                               // creates the table if it doesn't exist
  .then(() => app.listen(PORT, () => console.log(`Backend running on port ${PORT}`)))
  .catch((err) => { console.error("Database connection failed:", err.message); process.exit(1); });
