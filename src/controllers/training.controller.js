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
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        participation: {
          person: {
            name: "asc",
          },
        },
      },
    });

    // Tính toán số lượng theo role type
    const participantStats = participants.reduce(
      (acc, participant) => {
        const roleType = participant.participation.role.type;
        acc[roleType] = (acc[roleType] || 0) + 1;
        return acc;
      },
      { ATHLETE: 0, COACH: 0, SPECIALIST: 0, OTHER: 0 }
    );

    // Format gender trong response
    const formattedParticipants = participants.map((p) => ({
      participation_id: p.participation_id,
      training_id: p.training_id,
      note: p.note,
      created_by: p.created_by,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      creator: p.creator,
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
      data: {
        participants: formattedParticipants,
        stats: participantStats,
      },
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

// Cập nhật danh sách người tham gia và note
export const updateTrainingParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    const { participationIds, notes } = req.body; // notes là optional

    // Kiểm tra dữ liệu đầu vào
    if (!participationIds || !Array.isArray(participationIds)) {
      return res.status(400).json({
        success: false,
        message: "Danh sách người tham gia không hợp lệ",
      });
    }

    // Kiểm tra training tồn tại
    const training = await prisma.training.findUnique({
      where: { id: parseInt(id) },
    });

    if (!training) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đợt tập huấn",
      });
    }

    // Thực hiện các thao tác trong transaction
    await prisma.$transaction(async (tx) => {
      // 1. Xóa những người không còn trong danh sách
      const currentParticipants = await tx.trainingParticipant.findMany({
        where: { training_id: parseInt(id) },
        select: { participation_id: true },
      });

      const currentIds = currentParticipants.map((p) => p.participation_id);
      const newIds = participationIds.map((id) => parseInt(id));
      const idsToRemove = currentIds.filter((id) => !newIds.includes(id));

      if (idsToRemove.length > 0) {
        await tx.trainingParticipant.deleteMany({
          where: {
            training_id: parseInt(id),
            participation_id: { in: idsToRemove },
          },
        });
      }

      // 2. Thêm những người mới
      const idsToAdd = newIds.filter((id) => !currentIds.includes(id));
      if (idsToAdd.length > 0) {
        await tx.trainingParticipant.createMany({
          data: idsToAdd.map((participation_id) => ({
            training_id: parseInt(id),
            participation_id,
            created_by: req.user.id,
          })),
        });
      }

      // 3. Cập nhật notes nếu có
      if (notes && Array.isArray(notes)) {
        for (const item of notes) {
          await tx.trainingParticipant.update({
            where: {
              participation_id_training_id: {
                participation_id: parseInt(item.participation_id),
                training_id: parseInt(id),
              },
            },
            data: { note: item.note },
          });
        }
      }
    });

    // 4. Lấy danh sách đã cập nhật để trả về
    const updatedParticipants = await prisma.trainingParticipant.findMany({
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
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        participation: {
          person: {
            name: "asc",
          },
        },
      },
    });

    // Format response
    const formattedParticipants = updatedParticipants.map((p) => ({
      participation_id: p.participation_id,
      training_id: p.training_id,
      note: p.note,
      created_by: p.created_by,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
      creator: p.creator,
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
      message: "Cập nhật danh sách người tham gia thành công",
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
