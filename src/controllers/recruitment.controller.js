import { prisma } from "../config/prisma.js";

// Tạo tuyển dụng mới
export const createRecruitment = async (req, res) => {
  try {
    const { name, location, startDate, endDate, note } = req.body;

    const newRecruitment = await prisma.recruitment.create({
      data: {
        name,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        note,
        submitter_id: req.user.id, // Lấy id của user đang đăng nhập
      },
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Tạo thông tin tuyển dụng thành công",
      data: newRecruitment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách tuyển dụng
export const getRecruitments = async (req, res) => {
  try {
    const recruitments = await prisma.recruitment.findMany({
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });

    res.json({
      success: true,
      data: recruitments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy chi tiết tuyển dụng
export const getRecruitmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const recruitment = await prisma.recruitment.findUnique({
      where: { id: parseInt(id) },
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!recruitment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin tuyển dụng",
      });
    }

    res.json({
      success: true,
      data: recruitment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật tuyển dụng
export const updateRecruitment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, startDate, endDate, note } = req.body;

    // Kiểm tra quyền (chỉ người tạo mới được sửa)
    const recruitment = await prisma.recruitment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!recruitment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin tuyển dụng",
      });
    }

    if (recruitment.submitter_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền sửa thông tin này",
      });
    }

    const updatedRecruitment = await prisma.recruitment.update({
      where: { id: parseInt(id) },
      data: {
        name,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        note,
      },
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Cập nhật thông tin tuyển dụng thành công",
      data: updatedRecruitment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa tuyển dụng
export const deleteRecruitment = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra quyền (chỉ người tạo mới được xóa)
    const recruitment = await prisma.recruitment.findUnique({
      where: { id: parseInt(id) },
    });

    if (!recruitment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin tuyển dụng",
      });
    }

    if (recruitment.submitter_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền xóa thông tin này",
      });
    }

    await prisma.recruitment.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Xóa thông tin tuyển dụng thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
