import { prisma } from "../config/prisma.js";

// Thêm ghi nhận vắng mặt
export const createAbsence = async (req, res) => {
  try {
    const { participation_id } = req.params;
    const { type, startDate, endDate, note } = req.body;

    // Kiểm tra participation tồn tại
    const participation = await prisma.personOnConcentration.findUnique({
      where: { id: parseInt(participation_id) },
      include: {
        concentration: true,
      },
    });

    if (!participation) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin tham gia",
      });
    }

    // Kiểm tra thời gian hợp lệ
    const absenceStart = new Date(startDate);
    const absenceEnd = new Date(endDate);
    const concentrationStart = new Date(participation.concentration.startDate);
    const concentrationEnd = new Date(participation.concentration.endDate);

    if (absenceStart > absenceEnd) {
      return res.status(400).json({
        success: false,
        message: "Thời gian bắt đầu phải trước thời gian kết thúc",
      });
    }

    if (absenceStart < concentrationStart || absenceEnd > concentrationEnd) {
      return res.status(400).json({
        success: false,
        message:
          "Thời gian vắng mặt phải nằm trong thời gian của đợt tập trung",
      });
    }

    // Kiểm tra trùng lặp thời gian
    const existingAbsence = await prisma.absenceRecord.findFirst({
      where: {
        participation_id: parseInt(participation_id),
        OR: [
          {
            AND: [
              { startDate: { lte: absenceStart } },
              { endDate: { gte: absenceStart } },
            ],
          },
          {
            AND: [
              { startDate: { lte: absenceEnd } },
              { endDate: { gte: absenceEnd } },
            ],
          },
        ],
      },
    });

    if (existingAbsence) {
      return res.status(400).json({
        success: false,
        message: "Đã tồn tại ghi nhận vắng mặt trong khoảng thời gian này",
      });
    }

    const absence = await prisma.absenceRecord.create({
      data: {
        participation_id: parseInt(participation_id),
        type,
        startDate: absenceStart,
        endDate: absenceEnd,
        note,
        created_by: req.user.id,
      },
      include: {
        participation: {
          include: {
            person: true,
            role: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Thêm ghi nhận vắng mặt thành công",
      data: absence,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật ghi nhận vắng mặt
export const updateAbsence = async (req, res) => {
  try {
    const { participation_id, absence_id } = req.params;
    const { type, startDate, endDate, note } = req.body;

    const absenceStart = new Date(startDate);
    const absenceEnd = new Date(endDate);

    // Kiểm tra thời gian hợp lệ
    if (absenceStart > absenceEnd) {
      return res.status(400).json({
        success: false,
        message: "Thời gian bắt đầu phải trước thời gian kết thúc",
      });
    }

    // Kiểm tra trùng lặp với các ghi nhận khác
    const existingAbsence = await prisma.absenceRecord.findFirst({
      where: {
        participation_id: parseInt(participation_id),
        id: { not: parseInt(absence_id) },
        OR: [
          {
            AND: [
              { startDate: { lte: absenceStart } },
              { endDate: { gte: absenceStart } },
            ],
          },
          {
            AND: [
              { startDate: { lte: absenceEnd } },
              { endDate: { gte: absenceEnd } },
            ],
          },
        ],
      },
    });

    if (existingAbsence) {
      return res.status(400).json({
        success: false,
        message: "Đã tồn tại ghi nhận vắng mặt trong khoảng thời gian này",
      });
    }

    const absence = await prisma.absenceRecord.update({
      where: {
        id: parseInt(absence_id),
        participation_id: parseInt(participation_id),
      },
      data: {
        type,
        startDate: absenceStart,
        endDate: absenceEnd,
        note,
      },
      include: {
        participation: {
          include: {
            person: true,
            role: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: "Cập nhật ghi nhận vắng mặt thành công",
      data: absence,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa ghi nhận vắng mặt
export const deleteAbsence = async (req, res) => {
  try {
    const { participation_id, absence_id } = req.params;

    await prisma.absenceRecord.delete({
      where: {
        id: parseInt(absence_id),
        participation_id: parseInt(participation_id),
      },
    });

    res.json({
      success: true,
      message: "Xóa ghi nhận vắng mặt thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách vắng mặt của một người trong đợt tập trung
export const getAbsences = async (req, res) => {
  try {
    const { participation_id } = req.params;

    const absences = await prisma.absenceRecord.findMany({
      where: {
        participation_id: parseInt(participation_id),
      },
      include: {
        participation: {
          include: {
            person: true,
            role: true,
          },
        },
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });

    res.json({
      success: true,
      data: absences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
