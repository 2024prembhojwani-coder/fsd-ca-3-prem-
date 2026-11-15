const express = require("express");
const db = require("../db");
const authenticate = require("../middleware/auth");
const { validateRegistration } = require("../middleware/validate");

const router = express.Router();

const findOr404 = (id, next) => {
  const reg = db.registrations.find((r) => r.id === id);
  if (!reg) { const e = new Error("Registration not found"); e.status = 404; next(e); }
  return reg;
};

// GET /api/registrations?event=Hackathon&search=aar
router.get("/", (req, res) => {
  let list = db.registrations;
  if (req.query.event) list = list.filter((r) => r.event === req.query.event);
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    list = list.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
  }
  res.json(list);
});

// GET /api/registrations/:id
router.get("/:id", (req, res, next) => {
  const reg = findOr404(Number(req.params.id), next);
  if (reg) res.json(reg);
});

// POST /api/registrations
router.post("/", validateRegistration, (req, res) => {
  const { name, email, event, department, year } = req.body;
  if (db.registrations.some((r) => r.email === email && r.event === event))
    return res.status(409).json({ error: "Already registered for this event" });
  const reg = { id: db.nextRegId++, name: name.trim(), email, event, department, year };
  db.registrations.push(reg);
  res.status(201).json(reg);
});

// PUT /api/registrations/:id
router.put("/:id", validateRegistration, (req, res, next) => {
  const reg = findOr404(Number(req.params.id), next);
  if (!reg) return;
  const { name, email, event, department, year } = req.body;
  Object.assign(reg, { name: name.trim(), email, event, department, year });
  res.json(reg);
});

// DELETE /api/registrations/:id  (protected by JWT)
router.delete("/:id", authenticate, (req, res, next) => {
  const reg = findOr404(Number(req.params.id), next);
  if (!reg) return;
  db.registrations = db.registrations.filter((r) => r.id !== reg.id);
  res.json({ message: "Deleted", registration: reg });
});

module.exports = router;
