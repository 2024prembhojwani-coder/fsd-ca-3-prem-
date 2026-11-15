const { DataTypes } = require("sequelize");
const sequelize = require("./db");

// Schema: registrations(id, name, email, event, department, year, createdAt, updatedAt)
const Registration = sequelize.define(
  "Registration",
  {
    name: { type: DataTypes.STRING(50), allowNull: false, validate: { len: [2, 50] } },
    email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
    event: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    department: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
    year: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 4 } },
  },
  { tableName: "registrations", indexes: [{ unique: true, fields: ["email", "event"] }] }
);

module.exports = { sequelize, Registration };
