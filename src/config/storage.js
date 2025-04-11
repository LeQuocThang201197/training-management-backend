import multer from "multer";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import fs from "fs";

const isDevelopment = process.env.NODE_ENV === "development";

// Khởi tạo Supabase client cho production
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Config cho local storage
const localStorageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/papers";
    // Tạo thư mục nếu chưa tồn tại
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

// Config cho production (Supabase)
const productionStorageConfig = multer.memoryStorage();

// Export multer middleware dựa theo môi trường
export const upload = multer({
  storage: isDevelopment ? localStorageConfig : productionStorageConfig,
});

// Hàm upload file chung cho cả 2 môi trường
export const uploadFile = async (file, filePath) => {
  if (isDevelopment) {
    // Local: file đã được lưu bởi multer disk storage
    return {
      path: file.path,
      filename: file.filename,
    };
  } else {
    // Production: upload lên Supabase storage
    const { data, error } = await supabase.storage
      .from("papers")
      .upload(filePath, file.buffer);

    if (error) throw error;

    // Lấy public URL của file
    const {
      data: { publicUrl },
    } = supabase.storage.from("papers").getPublicUrl(data.path);

    return {
      path: publicUrl, // Trả về public URL thay vì path
      filename: file.originalname,
    };
  }
};
