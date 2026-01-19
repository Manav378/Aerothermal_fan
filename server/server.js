import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

import conndb from "./src/db/db.js";
import authrouter from "./src/routes/auth.routes.js";
import userrouter from "./src/routes/user.routes.js";
import dashboardroute from "./src/routes/dahboard.routes.js";
import DeviceRouter from "./src/routes/device.routes.js";

dotenv.config();
console.log("server starting...");

const app = express();

// ---------- PATH SETUP ----------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- CORS ----------
const allowedOrigins = [
  "http://localhost:5175",
  "https://aerothermal-fanfronted.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

app.options("*", cors());

// ---------- MIDDLEWARE ----------
app.use(express.json({ strict: false }));
app.use(cookieParser());

// ---------- DATABASE ----------
conndb();

// ---------- API ROUTES ----------
app.use("/api/dashboard", dashboardroute);
app.use("/api/auth", authrouter);
app.use("/api/device", DeviceRouter);
app.use("/api/user", userrouter);

// ---------- FRONTEND (VITE BUILD) ----------
app.use(
  express.static(path.join(__dirname, "../client/dist"))
);

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../client/dist/index.html")
  );
});

// ---------- SERVER ----------
const PORT = process.env.PORT || 4000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
