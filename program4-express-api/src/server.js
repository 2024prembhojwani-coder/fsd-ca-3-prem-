// Program 4 - Express.js REST API (CO5)
require("dotenv").config();
if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not set in .env");
const app = require("./app");

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
