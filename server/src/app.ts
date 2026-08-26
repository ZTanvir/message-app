import express from "express";
const app = express();
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import { setupJwtStrategy } from "./config/passport.ts";
import authRoute from "./routes/authRoutes.ts";
import profileRoute from "./routes/profileRoutes.ts";
import globalErrorHandler from "./middlewares/globalErrorHandler.ts";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(helmet());
setupJwtStrategy(passport);
app.use(passport.initialize());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.get("/health", async (req, res) => {
  res.json({
    status: "ok",
    timeStamp: new Date().toISOString(),
    service: "Message server",
  });
});

app.use("/api/auth", authRoute);
app.use("/api/profile", profileRoute);

app.use(globalErrorHandler);

export { app };
export default app;
