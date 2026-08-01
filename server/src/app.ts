import express from "express";
const app = express();

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timeStamp: new Date().toISOString(),
    service: "Message server",
  });
});

export { app };
export default app;
