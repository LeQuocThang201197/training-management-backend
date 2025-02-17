import { prisma } from "../config/prisma.js";

// Tạo đợt tập trung mới
export const createConcentration = async (req, res) => {
  try {
    const { teamId, location, startDate, endDate, note } = req.body;

    const newConcentration = await prisma.concentration.create({
      data: {
        teamId: parseInt(teamId),
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        note,
        submitter_id: req.user.id, // Lấy id của user đang đăng nhập
      },
      include: {
        team: {
          include: {
            sport: true,
          },
        },
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
      message: "Tạo đợt tập trung thành công",
      data: newConcentration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách đợt tập trung
export const getConcentrations = async (req, res) => {
  try {
    const concentrations = await prisma.concentration.findMany({
      include: {
        team: {
          include: {
            sport: true,
          },
        },
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        trainings: true, // Include các đợt tập huấn
      },
      orderBy: {
        startDate: "desc",
      },
    });

    res.json({
      success: true,
      data: concentrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy chi tiết đợt tập trung
export const getConcentrationById = async (req, res) => {
  try {
    const { id } = req.params;
    const concentration = await prisma.concentration.findUnique({
      where: { id: parseInt(id) },
      include: {
        team: {
          include: {
            sport: true,
          },
        },
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        trainings: {
          include: {
            submitter: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!concentration) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đợt tập trung",
      });
    }

    res.json({
      success: true,
      data: concentration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật đợt tập trung
export const updateConcentration = async (req, res) => {
  try {
    const { id } = req.params;
    const { teamId, location, startDate, endDate, note } = req.body;

    // Kiểm tra quyền (chỉ người tạo mới được sửa)
    const concentration = await prisma.concentration.findUnique({
      where: { id: parseInt(id) },
    });

    if (!concentration) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đợt tập trung",
      });
    }

    if (concentration.submitter_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền sửa thông tin này",
      });
    }

    const updatedConcentration = await prisma.concentration.update({
      where: { id: parseInt(id) },
      data: {
        teamId: parseInt(teamId),
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        note,
      },
      include: {
        team: {
          include: {
            sport: true,
          },
        },
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
      message: "Cập nhật đợt tập trung thành công",
      data: updatedConcentration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa đợt tập trung
export const deleteConcentration = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra quyền (chỉ người tạo mới được xóa)
    const concentration = await prisma.concentration.findUnique({
      where: { id: parseInt(id) },
    });

    if (!concentration) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đợt tập trung",
      });
    }

    if (concentration.submitter_id !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền xóa thông tin này",
      });
    }

    // Xóa tất cả các đợt tập huấn liên quan trước
    await prisma.training.deleteMany({
      where: { concentration_id: parseInt(id) },
    });

    // Sau đó xóa đợt tập trung
    await prisma.concentration.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Xóa đợt tập trung thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
