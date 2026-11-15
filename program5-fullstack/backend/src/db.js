const { Sequelize } = require("sequelize");

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

const isProd = process.env.NODE_ENV === "production";
const isPostgres =
  process.env.DATABASE_URL.startsWith("postgres://") ||
  process.env.DATABASE_URL.startsWith("postgresql://");

const sequelize = isPostgres
  ? new Sequelize(process.env.DATABASE_URL, {
      logging: false,
      // Render PostgreSQL requires SSL in production
      dialectOptions: isProd ? { ssl: { require: true, rejectUnauthorized: false } } : {},
    })
  : new Sequelize({
      dialect: "sqlite",
      storage: process.env.DATABASE_URL.replace(/^sqlite:\/\//, "").replace(/^sqlite:/, "") || "./database.sqlite",
      logging: false,
    });

module.exports = sequelize;
