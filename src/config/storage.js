import multer from "multer";
import { supabase } from "./supabase.js";
import fs from "fs";
import { normalizeFileName } from "../utils/fileUtils.js";

const isDevelopment = process.env.NODE_ENV === "development";

// Config cho local storage
const localStorageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/papers";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now();
    const normalizedName = normalizeFileName(file.originalname);
    cb(null, `${uniqueSuffix}-${normalizedName}`);
  },
});

// Export multer middleware
export const upload = multer({
  storage: isDevelopment ? localStorageConfig : multer.memoryStorage(),
});

// Hàm upload file
export const uploadFile = async (file) => {
  if (isDevelopment) {
    return {
      path: file.path,
      filename: file.filename,
    };
  } else {
    // Tạo normalized filename cho production
    const normalizedName = normalizeFileName(file.originalname);
    const filePath = `${Date.now()}-${normalizedName}`;

    const { data, error } = await supabase.storage
      .from("papers")
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("papers").getPublicUrl(filePath);

    return {
      path: publicUrl,
      filename: file.originalname,
    };
  }
};
