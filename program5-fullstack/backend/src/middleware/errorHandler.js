exports.notFound = (req, res, next) => {
  const err = new Error(`Route ${req.method} ${req.originalUrl} not found`);
  err.status = 404;
  next(err);
};

exports.errorHandler = (err, req, res, next) => {
  if (err.name === "SequelizeValidationError")
    return res.status(400).json({ error: "Validation failed", details: err.errors.map((e) => e.message) });
  if (err.name === "SequelizeUniqueConstraintError")
    return res.status(409).json({ error: "Already registered for this event" });
  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "Invalid JSON body" });
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? "Internal Server Error" : err.message });
};
