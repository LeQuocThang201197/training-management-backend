import { prisma } from "../config/prisma.js";

// Tạo văn bản mới
export const createPaper = async (req, res) => {
  try {
    const { number, code, publisher, type, content, related_year, date } =
      req.body;
    const file = req.file;

    const newPaper = await prisma.paper.create({
      data: {
        number: parseInt(number),
        code,
        publisher,
        type,
        content,
        related_year: parseInt(related_year),
        date: new Date(date),
        file_name: file?.originalname,
        file_path: file?.path,
      },
    });

    res.status(201).json({
      success: true,
      message: "Tạo văn bản thành công",
      data: newPaper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách văn bản
export const getPapers = async (req, res) => {
  try {
    const papers = await prisma.paper.findMany({
      orderBy: {
        date: "desc",
      },
    });

    res.json({
      success: true,
      data: papers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy chi tiết văn bản
export const getPaperById = async (req, res) => {
  try {
    const { id } = req.params;
    const paper = await prisma.paper.findUnique({
      where: { id: parseInt(id) },
    });

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy văn bản",
      });
    }

    res.json({
      success: true,
      data: paper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật văn bản
export const updatePaper = async (req, res) => {
  try {
    const { id } = req.params;
    const { number, code, publisher, type, content, related_year, date } =
      req.body;

    const updatedPaper = await prisma.paper.update({
      where: { id: parseInt(id) },
      data: {
        number: parseInt(number),
        code,
        publisher,
        type,
        content,
        related_year: parseInt(related_year),
        date: new Date(date),
      },
    });

    res.json({
      success: true,
      message: "Cập nhật văn bản thành công",
      data: updatedPaper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa văn bản
export const deletePaper = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.paper.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Xóa văn bản thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Thêm function để get file
export const getPaperFile = async (req, res) => {
  try {
    const { id } = req.params;
    const paper = await prisma.paper.findUnique({
      where: { id: parseInt(id) },
    });

    if (!paper || !paper.file_path) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy file",
      });
    }

    res.download(paper.file_path, paper.file_name, { inline: true });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
