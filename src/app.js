import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/prisma.js";
import routes from "./routes/index.js";
import session from "express-session";
import passport from "./config/passport.js";
import path from "path";
import pgSession from "connect-pg-simple";
import { pool } from "./config/db.js"; // Giả sử bạn đã có pool connection

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

const FRONTEND_URL =
  process.env.NODE_ENV === "production"
    ? process.env.FRONTEND_URL
    : "http://localhost:5173";

// CORS config
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      FRONTEND_URL,
      "http://localhost:5173",
      "https://training-management-woad.vercel.app",
    ];

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ["set-cookie"],
  maxAge: 86400,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PostgresStore = pgSession(session);

// Session middleware
app.use(
  session({
    store: new PostgresStore({
      pool: pool,
      tableName: "sessions",
      schemaName: "public",
    }),
    secret: process.env.SESSION_SECRET || "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 24 giờ
      sameSite: "none",
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Thêm middleware để serve static files
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Training Management API" });
});

// Routes
app.use("/api", routes);

// 3. Thêm trust proxy
app.set("trust proxy", 1);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API is available at http://localhost:${PORT}`);
});
