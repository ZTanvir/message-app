import { fileURLToPath } from "url";
import path, { dirname } from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "..", "..", `/.env.${process.env.NODE_ENV}`),
});

const config = {
  port: process.env.PORT,
  app_stage: process.env.APP_STAGE,
};

export default config;
