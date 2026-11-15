const express = require("express");
const logger = require("./middleware/logger");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
app.use(express.json());
app.use(logger);

app.get("/", (req, res) => res.json({ message: "College Event Registration API" }));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/registrations", require("./routes/registrations"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
