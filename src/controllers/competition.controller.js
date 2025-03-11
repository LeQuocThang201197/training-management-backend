import { prisma } from "../config/prisma.js";

const formatGender = (gender) => {
  return gender ? "Nam" : "Nữ";
};

// Tạo giải đấu mới
export const createCompetition = async (req, res) => {
  try {
    const {
      name,
      location,
      isForeign,
      startDate,
      endDate,
      description,
      note,
      is_confirmed,
      concentration_id,
    } = req.body;

    const competition = await prisma.competition.create({
      data: {
        name,
        location,
        isForeign,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        note,
        is_confirmed: is_confirmed || false,
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
        concentration: {
          select: {
            id: true,
            location: true,
            startDate: true,
            endDate: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Tạo giải đấu thành công",
      data: competition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách giải đấu của một concentration
export const getCompetitionsByConcentration = async (req, res) => {
  try {
    const { concentrationId } = req.params;

    const competitions = await prisma.competition.findMany({
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
        concentration: {
          select: {
            id: true,
            location: true,
            startDate: true,
            endDate: true,
          },
        },
        participants: {
          include: {
            participation: {
              include: {
                person: true,
                role: true,
                organization: true,
              },
            },
          },
        },
      },
      orderBy: {
        startDate: "asc",
      },
    });

    // Format response
    const formattedCompetitions = competitions.map((comp) => ({
      ...comp,
      participants: comp.participants.map((p) => ({
        ...p,
        participation: {
          ...p.participation,
          person: {
            ...p.participation.person,
            gender: formatGender(p.participation.person.gender),
          },
        },
      })),
    }));

    res.json({
      success: true,
      data: formattedCompetitions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy chi tiết một giải đấu
export const getCompetitionDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const competition = await prisma.competition.findUnique({
      where: {
        id: parseInt(id),
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

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giải đấu",
      });
    }

    res.json({
      success: true,
      data: competition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách người tham gia giải đấu
export const getCompetitionParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    const participants = await prisma.competitionParticipant.findMany({
      where: {
        competition_id: parseInt(id),
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

// Cập nhật giải đấu
export const updateCompetition = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      location,
      isForeign,
      startDate,
      endDate,
      description,
      note,
      is_confirmed,
    } = req.body;

    const competition = await prisma.competition.update({
      where: { id: parseInt(id) },
      data: {
        name,
        location,
        isForeign,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        note,
        is_confirmed,
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
      message: "Cập nhật giải đấu thành công",
      data: competition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa giải đấu
export const deleteCompetition = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.competition.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Xóa giải đấu thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Thêm người tham gia vào giải đấu
export const addParticipantToCompetition = async (req, res) => {
  try {
    const { id } = req.params;
    const { participation_id, startDate, endDate, note } = req.body;

    const participant = await prisma.competitionParticipant.create({
      data: {
        competition_id: parseInt(id),
        participation_id: parseInt(participation_id),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
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
        creator: {
          select: {
            id: true,
            name: true,
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

// Cập nhật thông tin tham gia giải đấu
export const updateCompetitionParticipant = async (req, res) => {
  try {
    const { id, participationId } = req.params;
    const { startDate, endDate, note } = req.body;

    const participant = await prisma.competitionParticipant.update({
      where: {
        participation_id_competition_id: {
          participation_id: parseInt(participationId),
          competition_id: parseInt(id),
        },
      },
      data: {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        note,
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

    res.json({
      success: true,
      message: "Cập nhật thông tin tham gia thành công",
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

// Xóa người tham gia khỏi giải đấu
export const removeCompetitionParticipant = async (req, res) => {
  try {
    const { id, participationId } = req.params;

    await prisma.competitionParticipant.delete({
      where: {
        participation_id_competition_id: {
          participation_id: parseInt(participationId),
          competition_id: parseInt(id),
        },
      },
    });

    res.json({
      success: true,
      message: "Xóa người tham gia thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật danh sách người tham gia và thông tin chi tiết
export const updateCompetitionParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    const { participationIds, participantDetails } = req.body;
    // participantDetails là mảng các object: { participation_id, startDate, endDate, note }

    // Kiểm tra dữ liệu đầu vào
    if (!participationIds || !Array.isArray(participationIds)) {
      return res.status(400).json({
        success: false,
        message: "Danh sách người tham gia không hợp lệ",
      });
    }

    // Kiểm tra competition tồn tại
    const competition = await prisma.competition.findUnique({
      where: { id: parseInt(id) },
    });

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giải đấu",
      });
    }

    // Thực hiện các thao tác trong transaction
    await prisma.$transaction(async (tx) => {
      // 1. Xóa những người không còn trong danh sách
      const currentParticipants = await tx.competitionParticipant.findMany({
        where: { competition_id: parseInt(id) },
        select: { participation_id: true },
      });

      const currentIds = currentParticipants.map((p) => p.participation_id);
      const newIds = participationIds.map((id) => parseInt(id));
      const idsToRemove = currentIds.filter((id) => !newIds.includes(id));

      if (idsToRemove.length > 0) {
        await tx.competitionParticipant.deleteMany({
          where: {
            competition_id: parseInt(id),
            participation_id: { in: idsToRemove },
          },
        });
      }

      // 2. Thêm những người mới
      const idsToAdd = newIds.filter((id) => !currentIds.includes(id));
      if (idsToAdd.length > 0) {
        await tx.competitionParticipant.createMany({
          data: idsToAdd.map((participation_id) => ({
            competition_id: parseInt(id),
            participation_id,
            startDate: competition.startDate, // Mặc định là ngày bắt đầu của giải
            endDate: competition.endDate, // Mặc định là ngày kết thúc của giải
            created_by: req.user.id,
          })),
        });
      }

      // 3. Cập nhật thông tin chi tiết nếu có
      if (participantDetails && Array.isArray(participantDetails)) {
        for (const detail of participantDetails) {
          await tx.competitionParticipant.update({
            where: {
              participation_id_competition_id: {
                participation_id: parseInt(detail.participation_id),
                competition_id: parseInt(id),
              },
            },
            data: {
              startDate: new Date(detail.startDate),
              endDate: new Date(detail.endDate),
              note: detail.note,
            },
          });
        }
      }
    });

    // 4. Lấy danh sách đã cập nhật để trả về
    const updatedParticipants = await prisma.competitionParticipant.findMany({
      where: {
        competition_id: parseInt(id),
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
