import { prisma } from "../config/prisma.js";
import { formatTeamInfo } from "../constants/index.js";

// Tạo đợt tập trung mới
export const createConcentration = async (req, res) => {
  try {
    const {
      teamId,
      location,
      startDate,
      endDate,
      related_year,
      sequence_number,
      note,
    } = req.body;

    // Kiểm tra overlap với các đợt tập trung khác của team
    const existingConcentrations = await prisma.concentration.findMany({
      where: {
        teamId: parseInt(teamId),
        OR: [
          {
            AND: [
              { startDate: { lte: new Date(endDate) } },
              { endDate: { gte: new Date(startDate) } },
            ],
          },
        ],
      },
    });

    if (existingConcentrations.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Đội này đã có đợt tập trung trong khoảng thời gian này",
        overlappingConcentrations: existingConcentrations,
      });
    }

    const newConcentration = await prisma.concentration.create({
      data: {
        teamId: parseInt(teamId),
        location,
        related_year: parseInt(related_year),
        sequence_number: parseInt(sequence_number),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        note,
        submitter_id: req.user.id,
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

    // Format response
    const formattedConcentration = {
      ...newConcentration,
      team: formatTeamInfo(newConcentration.team),
    };

    res.status(201).json({
      success: true,
      message: "Tạo đợt tập trung thành công",
      data: formattedConcentration,
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
        trainings: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    // Format team info theo chuẩn
    const formattedConcentrations = concentrations.map((concentration) => ({
      ...concentration,
      team: formatTeamInfo(concentration.team),
    }));

    res.json({
      success: true,
      data: formattedConcentrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy chi tiết đợt tập trung (không bao gồm papers)
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
      },
    });

    if (!concentration) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đợt tập trung",
      });
    }

    // Format response
    const formattedConcentration = {
      ...concentration,
      team: formatTeamInfo(concentration.team),
    };

    res.json({
      success: true,
      data: formattedConcentration,
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
    const {
      teamId,
      location,
      startDate,
      endDate,
      related_year,
      sequence_number,
      note,
    } = req.body;

    // Validate và parse dates
    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Ngày không hợp lệ",
      });
    }

    // Kiểm tra overlap với các đợt tập trung khác của team (trừ đợt hiện tại)
    const existingConcentrations = await prisma.concentration.findMany({
      where: {
        teamId: parseInt(teamId),
        NOT: {
          id: parseInt(id),
        },
        OR: [
          {
            AND: [
              { startDate: { lte: parsedEndDate } },
              { endDate: { gte: parsedStartDate } },
            ],
          },
        ],
      },
    });

    if (existingConcentrations.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Đội này đã có đợt tập trung trong khoảng thời gian này",
        overlappingConcentrations: existingConcentrations,
      });
    }

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
        related_year: parseInt(related_year),
        sequence_number: parseInt(sequence_number),
        startDate: parsedStartDate,
        endDate: parsedEndDate,
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

    // Format response
    const formattedConcentration = {
      ...updatedConcentration,
      team: formatTeamInfo(updatedConcentration.team),
    };

    res.json({
      success: true,
      message: "Cập nhật đợt tập trung thành công",
      data: formattedConcentration,
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

// Lấy danh sách papers của concentration
export const getPapersByConcentration = async (req, res) => {
  try {
    const { id } = req.params;
    const papers = await prisma.paperOnConcentration.findMany({
      where: {
        concentration_id: parseInt(id),
      },
      include: {
        paper: true,
      },
    });

    res.json({
      success: true,
      data: papers.map((p) => p.paper),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Gắn paper vào concentration
export const attachPaperToConcentration = async (req, res) => {
  try {
    const { id } = req.params;
    const { paperIds } = req.body; // Mảng các paper IDs

    const results = await Promise.all(
      paperIds.map(async (paperId) => {
        try {
          return await prisma.paperOnConcentration.create({
            data: {
              paper_id: parseInt(paperId),
              concentration_id: parseInt(id),
              assignedBy: req.user.id,
            },
            include: {
              paper: true,
              concentration: true,
            },
          });
        } catch (error) {
          return {
            paperId,
            error: error.message,
          };
        }
      })
    );

    res.json({
      success: true,
      message: "Đã gắn văn bản vào đợt tập trung",
      data: results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Gỡ paper khỏi concentration
export const detachPaperFromConcentration = async (req, res) => {
  try {
    const { id, paperId } = req.params;

    await prisma.paperOnConcentration.delete({
      where: {
        paper_id_concentration_id: {
          paper_id: parseInt(paperId),
          concentration_id: parseInt(id),
        },
      },
    });

    res.json({
      success: true,
      message: "Đã gỡ văn bản khỏi đợt tập trung",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật note của đợt tập trung
export const updateConcentrationNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

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
      data: { note },
    });

    res.json({
      success: true,
      message: "Cập nhật ghi chú thành công",
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

// Xóa ghi chú của đợt tập trung
export const deleteConcentrationNote = async (req, res) => {
  try {
    const { id } = req.params;

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
      data: { note: "" }, // Set note thành empty string
    });

    res.json({
      success: true,
      message: "Xóa ghi chú thành công",
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

// Lấy danh sách trainings của concentration
export const getTrainingsByConcentration = async (req, res) => {
  try {
    const { id } = req.params;
    const trainings = await prisma.training.findMany({
      where: {
        concentration_id: parseInt(id),
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
      orderBy: {
        startDate: "asc",
      },
    });

    res.json({
      success: true,
      data: trainings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
