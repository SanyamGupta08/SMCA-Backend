const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  GOOGLE_VISION_API_KEY: process.env.GOOGLE_VISION_API_KEY,
};
