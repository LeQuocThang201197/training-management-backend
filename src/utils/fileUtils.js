export const normalizeFileName = (fileName) => {
  // Bước 1: Chuyển đổi dấu sang không dấu
  const normalized = fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D"); // Xử lý chữ đ

  // Bước 2: Thay thế các ký tự không an toàn
  return normalized
    .replace(/[^a-zA-Z0-9-_. ]/g, "") // Chỉ giữ lại chữ, số, dấu gạch, dấu chấm và khoảng trắng
    .replace(/\s+/g, "_"); // Thay khoảng trắng bằng dấu gạch dưới
};
