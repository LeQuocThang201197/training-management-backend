import multer from "multer";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Memory storage instead of disk
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// New function to upload to Supabase
export const uploadToSupabase = async (file, path) => {
  const { data, error } = await supabase.storage
    .from("papers")
    .upload(path, file.buffer, {
      contentType: file.mimetype,
      upsert: true,
    });

  if (error) throw error;
  return data;
};
