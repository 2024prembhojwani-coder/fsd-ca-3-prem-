// Centralized error handling
exports.notFound = (req, res, next) => {
  const err = new Error(`Route ${req.method} ${req.originalUrl} not found`);
  err.status = 404;
  next(err);
};

exports.errorHandler = (err, req, res, next) => {
  if (err.type === "entity.parse.failed") err.status = 400, err.message = "Invalid JSON body";
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).json({ error: status === 500 ? "Internal Server Error" : err.message });
};
