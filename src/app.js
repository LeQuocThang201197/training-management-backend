import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/prisma.js";
import routes from "./routes/index.js";
import session from "express-session";
import passport from "./config/passport.js";
import path from "path";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS config
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow localhost for development
      callback(null, "http://localhost:5173");
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
    exposedHeaders: ["set-cookie"],
  })
);

// Thêm middleware để xử lý preflight requests
app.options("*", cors());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: false, // Not needed for local development
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for local HTTP
      sameSite: "lax", // Default for same-origin
      maxAge: 24 * 60 * 60 * 1000,
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

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API is available at http://localhost:${PORT}`);
});
