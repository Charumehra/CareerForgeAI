const express = require("express");
const authRouter = require("./src/routes/auth.routes");
const interviewRouter = require("./src/routes/interview.routes")
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

/**  using all routes here */
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter)

module.exports = app;
