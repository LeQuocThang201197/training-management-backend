export const normalizeFileName = (fileName) => {
  // Tách tên file và phần mở rộng
  const lastDotIndex = fileName.lastIndexOf(".");
  const name = lastDotIndex !== -1 ? fileName.slice(0, lastDotIndex) : fileName;
  const ext = lastDotIndex !== -1 ? fileName.slice(lastDotIndex) : "";

  // Xử lý phần tên
  const normalizedName = name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Bỏ dấu
    .replace(/[đĐ]/g, "d") // Xử lý chữ đ
    .toLowerCase() // Chuyển về chữ thường
    .replace(/[^a-z0-9-_.]/g, "-") // Thay thế ký tự không hợp lệ bằng dấu gạch ngang
    .replace(/-+/g, "-") // Gộp nhiều dấu gạch ngang liên tiếp
    .replace(/^-+|-+$/g, ""); // Xóa dấu gạch ngang ở đầu và cuối

  // Ghép lại với phần mở rộng
  return normalizedName + ext.toLowerCase();
};
