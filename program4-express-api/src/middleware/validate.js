// Input validation middleware
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

exports.validateRegistration = (req, res, next) => {
  const { name, email, event, department, year } = req.body;
  const errors = [];
  if (typeof name !== "string" || !/^[A-Za-z][A-Za-z .'-]{1,49}$/.test(name.trim())) errors.push("name must be 2-50 letters");
  if (typeof email !== "string" || !EMAIL.test(email)) errors.push("email is invalid");
  if (typeof event !== "string" || !event.trim()) errors.push("event is required");
  if (typeof department !== "string" || !department.trim()) errors.push("department is required");
  if (!Number.isInteger(year) || year < 1 || year > 4) errors.push("year must be an integer 1-4");
  if (errors.length) return res.status(400).json({ error: "Validation failed", details: errors });
  next();
};

exports.validateAuth = (req, res, next) => {
  const { username, password } = req.body;
  const errors = [];
  if (typeof username !== "string" || username.trim().length < 3) errors.push("username must be at least 3 characters");
  if (typeof password !== "string" || password.length < 6) errors.push("password must be at least 6 characters");
  if (errors.length) return res.status(400).json({ error: "Validation failed", details: errors });
  next();
};
