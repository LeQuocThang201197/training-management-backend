import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import fs from "fs";
import { normalizeFileName } from "../utils/fileUtils.js";

const isDevelopment = process.env.NODE_ENV === "development";

// Khởi tạo Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      persistSession: false,
    },
  }
);

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
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

// Export multer middleware
export const upload = multer({
  storage: isDevelopment ? localStorageConfig : multer.memoryStorage(),
});

// Hàm upload file
export const uploadFile = async (file, filePath) => {
  // Chuẩn hóa tên file
  const normalizedFileName = normalizeFileName(file.originalname);
  const timestamp = Date.now();
  const safeFilePath = `${timestamp}-${normalizedFileName}`;

  if (isDevelopment) {
    return {
      path: file.path,
      filename: normalizedFileName,
    };
  } else {
    const { data, error } = await supabase.storage
      .from("papers")
      .upload(safeFilePath, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) throw error;

    const {
      data: { publicUrl },
    } = supabase.storage.from("papers").getPublicUrl(safeFilePath);

    return {
      path: publicUrl,
      filename: normalizedFileName,
    };
  }
};
