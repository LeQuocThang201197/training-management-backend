import { prisma } from "../config/prisma.js";

export const createSport = async (req, res) => {
  try {
    const { name } = req.body;

    // Kiểm tra sport đã tồn tại
    const existingSport = await prisma.sport.findUnique({
      where: { name },
    });

    if (existingSport) {
      return res.status(400).json({
        success: false,
        message: "Tên môn thể thao đã tồn tại",
      });
    }

    const newSport = await prisma.sport.create({
      data: { name },
    });

    res.status(201).json({
      success: true,
      message: "Tạo môn thể thao thành công",
      data: newSport,
    });
  } catch (error) {
    // Xử lý lỗi Prisma unique constraint
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Tên môn thể thao đã tồn tại",
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const getSports = async (req, res) => {
  try {
    const sports = await prisma.sport.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({
      success: true,
      data: sports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const getSportById = async (req, res) => {
  try {
    const { id } = req.params;
    const sport = await prisma.sport.findUnique({
      where: { id: parseInt(id) },
    });
    if (!sport) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy môn thể thao",
      });
    }
    res.json({
      success: true,
      data: sport,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const updateSport = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    // Kiểm tra tên mới có trùng với sport khác không
    const existingSport = await prisma.sport.findFirst({
      where: {
        name,
        NOT: {
          id: parseInt(id),
        },
      },
    });

    if (existingSport) {
      return res.status(400).json({
        success: false,
        message: "Tên môn thể thao đã tồn tại",
      });
    }

    const updatedSport = await prisma.sport.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    res.json({
      success: true,
      message: "Cập nhật môn thể thao thành công",
      data: updatedSport,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Tên môn thể thao đã tồn tại",
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const deleteSport = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.sport.delete({
      where: { id: parseInt(id) },
    });
    res.json({
      success: true,
      message: "Xóa môn thể thao thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
