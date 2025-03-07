import { prisma } from "../config/prisma.js";

const formatGender = (gender) => {
  return gender ? "Nam" : "Nữ";
};

// Tạo giải đấu mới
export const createCompetition = async (req, res) => {
  try {
    const { name, location, isForeign, startDate, endDate, description, note } =
      req.body;

    const competition = await prisma.competition.create({
      data: {
        name,
        location,
        isForeign,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        description,
        note,
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
        participants: {
          some: {
            participation: {
              concentration_id: parseInt(concentrationId),
            },
          },
        },
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
      data: competitions,
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
    const { participation_id, note } = req.body;

    const participant = await prisma.competitionParticipant.create({
      data: {
        competition_id: parseInt(id),
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
