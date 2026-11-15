const express = require("express");
const { Op } = require("sequelize");
const { Registration } = require("../models");

const router = express.Router();
const FIELDS = ["name", "email", "event", "department", "year"];
const pick = (body) => Object.fromEntries(FIELDS.map((f) => [f, body[f]]));

// GET /api/registrations?search=&event=
router.get("/", async (req, res, next) => {
  try {
    const where = {};
    if (req.query.event) where.event = req.query.event;
    if (req.query.search)
      where[Op.or] = [
        { name: { [Op.iLike]: `%${req.query.search}%` } },
        { email: { [Op.iLike]: `%${req.query.search}%` } },
      ];
    res.json(await Registration.findAll({ where, order: [["id", "ASC"]] }));
  } catch (e) { next(e); }
});

// POST /api/registrations
router.post("/", async (req, res, next) => {
  try {
    const data = pick(req.body);
    if (data.email) data.email = String(data.email).trim().toLowerCase();
    res.status(201).json(await Registration.create(data));
  } catch (e) { next(e); }
});

// PUT /api/registrations/:id
router.put("/:id", async (req, res, next) => {
  try {
    const reg = await Registration.findByPk(req.params.id);
    if (!reg) return res.status(404).json({ error: "Registration not found" });
    res.json(await reg.update(pick(req.body)));
  } catch (e) { next(e); }
});

// DELETE /api/registrations/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const reg = await Registration.findByPk(req.params.id);
    if (!reg) return res.status(404).json({ error: "Registration not found" });
    await reg.destroy();
    res.json({ message: "Deleted" });
  } catch (e) { next(e); }
});

module.exports = router;
