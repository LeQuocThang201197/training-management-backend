import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/prisma.js";
import routes from "./routes/index.js";

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS config
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
