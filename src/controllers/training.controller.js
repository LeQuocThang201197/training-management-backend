import { prisma } from "../config/prisma.js";

const formatGender = (gender) => {
  return gender ? "Nam" : "Nữ";
};

// Tạo đợt tập huấn mới
export const createTraining = async (req, res) => {
  try {
    const { location, isForeign, startDate, endDate, note, concentration_id } =
      req.body;

    const training = await prisma.training.create({
      data: {
        location,
        isForeign,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        note,
        concentration_id: parseInt(concentration_id),
        created_by: req.user.id,
      },
      include: {
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
      message: "Tạo đợt tập huấn thành công",
      data: training,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật đợt tập huấn
export const updateTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, isForeign, startDate, endDate, note } = req.body;

    const training = await prisma.training.update({
      where: { id: parseInt(id) },
      data: {
        location,
        isForeign,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        note,
      },
      include: {
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
      message: "Cập nhật đợt tập huấn thành công",
      data: training,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa đợt tập huấn
export const deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.training.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Xóa đợt tập huấn thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Thêm người tham gia vào đợt tập huấn
export const addParticipantToTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const { participation_id, note } = req.body;

    const participant = await prisma.trainingParticipant.create({
      data: {
        training_id: parseInt(id),
        participation_id: parseInt(participation_id),
        note: note || "",
        created_by: req.user.id,
      },
      include: {
        participation: {
          include: {
            person: true,
            role: true,
            organization: true,
          },
        },
      },
    });

    // Format gender trong response
    const formattedParticipant = {
      ...participant,
      participation: {
        ...participant.participation,
        person: {
          ...participant.participation.person,
          gender: formatGender(participant.participation.person.gender),
        },
      },
    };

    res.status(201).json({
      success: true,
      message: "Thêm người tham gia thành công",
      data: formattedParticipant,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách người tham gia đợt tập huấn
export const getTrainingParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    const participants = await prisma.trainingParticipant.findMany({
      where: {
        training_id: parseInt(id),
      },
      include: {
        participation: {
          include: {
            person: true,
            role: true,
            organization: true,
          },
        },
      },
    });

    // Format gender trong response
    const formattedParticipants = participants.map((p) => ({
      ...p,
      participation: {
        ...p.participation,
        person: {
          ...p.participation.person,
          gender: formatGender(p.participation.person.gender),
        },
      },
    }));

    res.json({
      success: true,
      data: formattedParticipants,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách training của một concentration
export const getTrainingsByConcentration = async (req, res) => {
  try {
    const { concentrationId } = req.params;

    const trainings = await prisma.training.findMany({
      where: {
        concentration_id: parseInt(concentrationId),
      },
      include: {
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
