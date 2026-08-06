import express from "express";
const app = express();
import morgan from "morgan";
import helmet from "helmet";
import authRoute from "./routes/authRoutes.ts";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timeStamp: new Date().toISOString(),
    service: "Message server",
  });
});

app.use("/api/auth", authRoute);

export { app };
export default app;
