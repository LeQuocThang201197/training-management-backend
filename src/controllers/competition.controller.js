import { prisma } from "../config/prisma.js";
import { formatTeamInfo, MANAGEMENT_ROOMS } from "../constants/index.js";

const formatGender = (gender) => {
  return gender ? "Nam" : "Nữ";
};

const formatTeamType = (type) => {
  const typeMap = {
    JUNIOR: "Trẻ",
    ADULT: "Tuyển",
    DISABILITY: "Khuyết tật",
  };
  return typeMap[type] || type;
};

const formatTeamGender = (gender) => {
  const genderMap = {
    MALE: "Nam",
    FEMALE: "Nữ",
    MIXED: "Nam và Nữ",
  };
  return genderMap[gender] || gender;
};

// Helper function để lấy thời điểm đầu ngày hiện tại
const getStartOfDay = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
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
        created_by: req.user.id,
        concentrations: {
          create: {
            concentration_id: parseInt(concentration_id),
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
        concentrations: {
          include: {
            concentration: {
              select: {
                id: true,
                location: true,
                startDate: true,
                endDate: true,
              },
            },
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
        concentrations: {
          some: {
            concentration_id: parseInt(concentrationId),
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
        concentrations: {
          include: {
            concentration: {
              select: {
                id: true,
                location: true,
                startDate: true,
                endDate: true,
              },
            },
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

// Lấy chi tiết một giải đấu theo ID
export const getCompetitionById = async (req, res) => {
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
        concentrations: {
          include: {
            concentration: {
              select: {
                id: true,
                location: true,
                startDate: true,
                endDate: true,
                room: true,
                related_year: true,
                sequence_number: true,
                note: true,
                team: {
                  include: {
                    sport: true,
                  },
                },
                participants: {
                  include: {
                    role: true,
                    absences: {
                      where: {
                        type: "INACTIVE",
                        AND: [
                          {
                            startDate: {
                              lte: getStartOfDay(),
                            },
                          },
                          {
                            endDate: {
                              gte: getStartOfDay(),
                            },
                          },
                        ],
                      },
                    },
                  },
                },
                trainings: {
                  include: {
                    participants: {
                      include: {
                        participation: {
                          include: {
                            role: true,
                          },
                        },
                      },
                    },
                  },
                },
                competitionConcentrations: {
                  include: {
                    competition: {
                      include: {
                        participants: {
                          include: {
                            participation: {
                              include: {
                                role: true,
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
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

    // Format concentrations với đầy đủ thông tin giống getConcentrations
    const formattedConcentrations = competition.concentrations.map((cc) => {
      const concentration = cc.concentration;

      // Tính toán số lượng người tham gia concentration theo role type
      const participantStats = concentration.participants.reduce(
        (acc, participant) => {
          // Nếu người này đang INACTIVE thì không tính
          if (participant.absences.length > 0) {
            return acc;
          }

          const roleType = participant.role.type;
          acc[roleType] = (acc[roleType] || 0) + 1;
          return acc;
        },
        { ATHLETE: 0, COACH: 0, SPECIALIST: 0, OTHER: 0 }
      );

      // Format trainings và tính số lượng người tham gia
      const formattedTrainings = concentration.trainings.map((training) => {
        // Tính toán số lượng người tham gia training theo role type
        const trainingStats = training.participants.reduce(
          (acc, participant) => {
            const roleType = participant.participation.role.type;
            acc[roleType] = (acc[roleType] || 0) + 1;
            return acc;
          },
          { ATHLETE: 0, COACH: 0, SPECIALIST: 0, OTHER: 0 }
        );

        // Loại bỏ thông tin chi tiết participants
        const { participants, ...trainingInfo } = training;

        return {
          ...trainingInfo,
          participantStats: trainingStats,
          totalParticipants: training.participants.length,
        };
      });

      // Format competitions và tính số lượng người tham gia
      const formattedCompetitions = concentration.competitionConcentrations.map(
        (competitionConcentration) => {
          const comp = competitionConcentration.competition;
          // Tính toán số lượng người tham gia competition theo role type
          const competitionStats = comp.participants.reduce(
            (acc, participant) => {
              const roleType = participant.participation.role.type;
              acc[roleType] = (acc[roleType] || 0) + 1;
              return acc;
            },
            { ATHLETE: 0, COACH: 0, SPECIALIST: 0, OTHER: 0 }
          );

          // Loại bỏ thông tin chi tiết participants
          const { participants, ...competitionInfo } = comp;

          return {
            ...competitionInfo,
            participantStats: competitionStats,
            totalParticipants: comp.participants.length,
          };
        }
      );

      return {
        ...cc,
        concentration: {
          ...concentration,
          team: formatTeamInfo(concentration.team),
          room: MANAGEMENT_ROOMS[concentration.room],
          participantStats,
          trainings: formattedTrainings,
          competitions: formattedCompetitions,
          participants: undefined, // Không trả về danh sách chi tiết người tham gia
          competitionConcentrations: undefined, // Loại bỏ raw data của bảng trung gian
        },
      };
    });

    // Tính toán số lượng người tham gia competition theo role type
    const participantStats = competition.participants.reduce(
      (acc, participant) => {
        const roleType = participant.participation.role.type;
        acc[roleType] = (acc[roleType] || 0) + 1;
        return acc;
      },
      { ATHLETE: 0, COACH: 0, SPECIALIST: 0, OTHER: 0 }
    );

    // Format participants với gender
    const formattedParticipants = competition.participants.map((p) => ({
      ...p,
      participation: {
        ...p.participation,
        person: {
          ...p.participation.person,
          gender: formatGender(p.participation.person.gender),
        },
      },
    }));

    const formattedCompetition = {
      ...competition,
      concentrations: formattedConcentrations,
      participantStats,
      totalParticipants: competition.participants.length,
      participants: undefined, // Không trả về danh sách chi tiết người tham gia
    };

    res.json({
      success: true,
      data: formattedCompetition,
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
    const competitionId = parseInt(id);

    // Kiểm tra competition tồn tại
    const competition = await prisma.competition.findUnique({
      where: { id: competitionId },
    });

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giải đấu",
      });
    }

    // Xóa theo thứ tự: participants -> concentrations -> competition
    await prisma.$transaction(async (tx) => {
      // 1. Xóa tất cả người tham gia competition
      await tx.competitionParticipant.deleteMany({
        where: { competition_id: competitionId },
      });

      // 2. Xóa tất cả liên kết với concentrations
      await tx.competitionConcentration.deleteMany({
        where: { competition_id: competitionId },
      });

      // 3. Xóa competition chính
      await tx.competition.delete({
        where: { id: competitionId },
      });
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

// Lấy danh sách giải đấu với pagination, sort, filter, search
export const getCompetitions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      search = "",
      sortBy = "startDate",
      sortOrder = "desc",
      isForeign,
      is_confirmed,
      startDate,
      endDate,
      status,
      sportId,
    } = req.query;

    // Build where condition
    const whereCondition = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { location: { contains: search, mode: "insensitive" } },
          { note: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(isForeign !== undefined && { isForeign: isForeign === "true" }),
      ...(is_confirmed !== undefined && {
        is_confirmed: is_confirmed === "true",
      }),
      ...(startDate && { startDate: { gte: new Date(startDate) } }),
      ...(endDate && { endDate: { lte: new Date(endDate) } }),
      ...(sportId && {
        concentrations: {
          some: {
            concentration: {
              team: {
                sportId: parseInt(sportId),
              },
            },
          },
        },
      }),
    };

    // Filter theo trạng thái
    if (status) {
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const endOfDay = new Date(now.setHours(23, 59, 59, 999));

      // Hỗ trợ multiple status (upcoming,ongoing,completed)
      const statusArray = status.split(",");
      const statusConditions = [];

      statusArray.forEach((s) => {
        const trimmedStatus = s.trim();
        if (trimmedStatus === "upcoming") {
          statusConditions.push({ startDate: { gt: endOfDay } });
        } else if (trimmedStatus === "ongoing") {
          statusConditions.push({
            AND: [
              { startDate: { lte: endOfDay } },
              { endDate: { gte: startOfDay } },
            ],
          });
        } else if (trimmedStatus === "completed") {
          statusConditions.push({ endDate: { lt: startOfDay } });
        }
      });

      if (statusConditions.length > 0) {
        whereCondition.OR = statusConditions;
      }
    }

    // Count total
    const total = await prisma.competition.count({ where: whereCondition });

    // Get competitions with pagination
    const competitions = await prisma.competition.findMany({
      where: whereCondition,
      include: {
        creator: {
          select: { id: true, name: true },
        },
        concentrations: {
          include: {
            concentration: {
              select: {
                id: true,
                location: true,
                startDate: true,
                endDate: true,
                team: {
                  select: {
                    sport: { select: { name: true } },
                    type: true,
                    gender: true,
                  },
                },
              },
            },
          },
        },
        participants: {
          include: {
            participation: {
              include: {
                role: true,
              },
            },
          },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    // Format response
    const formattedCompetitions = competitions.map((comp) => {
      // Tính toán số lượng người tham gia competition theo role type
      const participantStats = comp.participants.reduce(
        (acc, participant) => {
          const roleType = participant.participation.role.type;
          acc[roleType] = (acc[roleType] || 0) + 1;
          return acc;
        },
        { ATHLETE: 0, COACH: 0, SPECIALIST: 0, OTHER: 0 }
      );

      // Format concentrations với thông tin team
      const formattedConcentrations = comp.concentrations.map((cc) => ({
        ...cc,
        concentration: {
          ...cc.concentration,
          team: {
            sport: cc.concentration.team.sport,
            type: formatTeamType(cc.concentration.team.type),
            gender: formatTeamGender(cc.concentration.team.gender),
          },
        },
      }));

      // Loại bỏ thông tin chi tiết participants
      const { participants, ...competitionInfo } = comp;

      return {
        ...competitionInfo,
        concentrations: formattedConcentrations,
        participantStats,
        totalParticipants: comp.participants.length,
      };
    });

    res.json({
      success: true,
      data: formattedCompetitions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
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

// Lấy thống kê tổng quan về giải đấu
export const getCompetitionStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    // Lấy tổng số giải đấu
    const total = await prisma.competition.count();

    // Lấy giải đấu sắp diễn ra (chưa bắt đầu)
    const upcoming = await prisma.competition.count({
      where: {
        startDate: {
          gt: endOfDay,
        },
      },
    });

    // Lấy giải đấu đang diễn ra
    const ongoing = await prisma.competition.count({
      where: {
        startDate: {
          lte: endOfDay,
        },
        endDate: {
          gte: startOfDay,
        },
      },
    });

    // Lấy giải đấu đã kết thúc
    const completed = await prisma.competition.count({
      where: {
        endDate: {
          lt: startOfDay,
        },
      },
    });

    res.json({
      success: true,
      data: {
        total,
        upcoming,
        ongoing,
        completed,
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

// Thêm concentration vào giải đấu
export const addConcentrationToCompetition = async (req, res) => {
  try {
    const { id } = req.params;
    const { concentration_id } = req.body;

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

    // Kiểm tra concentration tồn tại
    const concentration = await prisma.concentration.findUnique({
      where: { id: parseInt(concentration_id) },
      include: {
        team: {
          include: {
            sport: true,
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

    // Kiểm tra xem đã liên kết chưa
    const existingLink = await prisma.competitionConcentration.findUnique({
      where: {
        competition_id_concentration_id: {
          competition_id: parseInt(id),
          concentration_id: parseInt(concentration_id),
        },
      },
    });

    if (existingLink) {
      return res.status(400).json({
        success: false,
        message: "Đợt tập trung này đã được liên kết với giải đấu",
      });
    }

    // Tạo liên kết mới
    const link = await prisma.competitionConcentration.create({
      data: {
        competition_id: parseInt(id),
        concentration_id: parseInt(concentration_id),
      },
      include: {
        concentration: {
          include: {
            team: {
              include: {
                sport: true,
              },
            },
          },
        },
      },
    });

    // Format response
    const formattedLink = {
      ...link,
      concentration: {
        ...link.concentration,
        team: formatTeamInfo(link.concentration.team),
        room: MANAGEMENT_ROOMS[link.concentration.room],
      },
    };

    res.status(201).json({
      success: true,
      message: "Thêm đợt tập trung vào giải đấu thành công",
      data: formattedLink,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa concentration khỏi giải đấu
export const removeConcentrationFromCompetition = async (req, res) => {
  try {
    const { id, concentrationId } = req.params;

    // Kiểm tra liên kết tồn tại
    const existingLink = await prisma.competitionConcentration.findUnique({
      where: {
        competition_id_concentration_id: {
          competition_id: parseInt(id),
          concentration_id: parseInt(concentrationId),
        },
      },
    });

    if (!existingLink) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy liên kết giữa giải đấu và đợt tập trung",
      });
    }

    // Xóa liên kết
    await prisma.competitionConcentration.delete({
      where: {
        competition_id_concentration_id: {
          competition_id: parseInt(id),
          concentration_id: parseInt(concentrationId),
        },
      },
    });

    res.json({
      success: true,
      message: "Xóa đợt tập trung khỏi giải đấu thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách concentrations có thể thêm vào giải đấu
export const getAvailableConcentrations = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, search = "" } = req.query;

    // Build where condition
    const whereCondition = {
      NOT: {
        competitionConcentrations: {
          some: {
            competition_id: parseInt(id),
          },
        },
      },
      ...(search && {
        OR: [
          {
            location: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            team: {
              sport: {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      }),
    };

    // Count total
    const total = await prisma.concentration.count({
      where: whereCondition,
    });

    // Get concentrations với pagination
    const concentrations = await prisma.concentration.findMany({
      where: whereCondition,
      include: {
        team: {
          include: {
            sport: true,
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
        startDate: "desc",
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    // Format response
    const formattedConcentrations = concentrations.map((concentration) => ({
      ...concentration,
      team: formatTeamInfo(concentration.team),
      room: MANAGEMENT_ROOMS[concentration.room],
    }));

    res.json({
      success: true,
      data: formattedConcentrations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
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

// Lấy danh sách người tham gia có thể thêm vào giải đấu (từ các concentrations đã liên kết)
export const getAvailableParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20, search = "", roleType = "" } = req.query;

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

    // Lấy danh sách concentration_ids đã liên kết với competition
    const linkedConcentrations = await prisma.competitionConcentration.findMany(
      {
        where: {
          competition_id: parseInt(id),
        },
        select: {
          concentration_id: true,
        },
      }
    );

    const concentrationIds = linkedConcentrations.map(
      (cc) => cc.concentration_id
    );

    if (concentrationIds.length === 0) {
      return res.json({
        success: true,
        data: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0,
        },
        message: "Chưa có đợt tập trung nào được liên kết với giải đấu này",
      });
    }

    // Lấy danh sách người đã tham gia competition này
    const existingParticipants = await prisma.competitionParticipant.findMany({
      where: {
        competition_id: parseInt(id),
      },
      select: {
        participation_id: true,
      },
    });

    const existingParticipationIds = existingParticipants.map(
      (p) => p.participation_id
    );

    // Build where condition cho search
    const whereCondition = {
      concentration_id: { in: concentrationIds },
      NOT: {
        id: { in: existingParticipationIds },
      },
      ...(roleType && {
        role: {
          type: roleType,
        },
      }),
      ...(search && {
        person: {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
            {
              id_number: {
                contains: search,
                mode: "insensitive",
              },
            },
          ],
        },
      }),
    };

    // Count total
    const total = await prisma.personOnConcentration.count({
      where: whereCondition,
    });

    // Get participants với pagination
    const participants = await prisma.personOnConcentration.findMany({
      where: whereCondition,
      include: {
        person: true,
        role: true,
        organization: true,
        concentration: {
          include: {
            team: {
              include: {
                sport: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          person: {
            name: "asc",
          },
        },
      ],
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    // Format response
    const formattedParticipants = participants.map((p) => ({
      ...p,
      person: {
        ...p.person,
        gender: formatGender(p.person.gender),
      },
      concentration: {
        ...p.concentration,
        team: formatTeamInfo(p.concentration.team),
        room: MANAGEMENT_ROOMS[p.concentration.room],
      },
    }));

    res.json({
      success: true,
      data: formattedParticipants,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
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
