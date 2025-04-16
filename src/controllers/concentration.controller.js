import { prisma } from "../config/prisma.js";
import { formatTeamInfo, MANAGEMENT_ROOMS } from "../constants/index.js";
import { Prisma } from "@prisma/client";

// Tạo đợt tập trung mới
export const createConcentration = async (req, res) => {
  try {
    const {
      teamId,
      location,
      room,
      startDate,
      endDate,
      related_year,
      sequence_number,
      note,
    } = req.body;

    // Validate room
    if (!Object.keys(MANAGEMENT_ROOMS).includes(room)) {
      return res.status(400).json({
        success: false,
        message: "Invalid management room",
      });
    }

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
        room,
        related_year: parseInt(related_year),
        sequence_number: parseInt(sequence_number),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        note,
        created_by: req.user.id,
      },
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
    });

    // Format response
    const formattedConcentration = {
      ...newConcentration,
      team: formatTeamInfo(newConcentration.team),
      room: MANAGEMENT_ROOMS[newConcentration.room],
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
        creator: {
          select: {
            id: true,
            name: true,
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
        competitions: {
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
      orderBy: {
        startDate: "desc",
      },
    });

    // Format response và thêm số lượng người tham gia theo role type
    const formattedConcentrations = concentrations.map((concentration) => {
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
      const formattedCompetitions = concentration.competitions.map(
        (competition) => {
          // Tính toán số lượng người tham gia competition theo role type
          const competitionStats = competition.participants.reduce(
            (acc, participant) => {
              const roleType = participant.participation.role.type;
              acc[roleType] = (acc[roleType] || 0) + 1;
              return acc;
            },
            { ATHLETE: 0, COACH: 0, SPECIALIST: 0, OTHER: 0 }
          );

          // Loại bỏ thông tin chi tiết participants
          const { participants, ...competitionInfo } = competition;

          return {
            ...competitionInfo,
            participantStats: competitionStats,
            totalParticipants: competition.participants.length,
          };
        }
      );

      return {
        ...concentration,
        team: formatTeamInfo(concentration.team),
        room: MANAGEMENT_ROOMS[concentration.room],
        participantStats,
        trainings: formattedTrainings,
        competitions: formattedCompetitions,
        participants: undefined, // Không trả về danh sách chi tiết người tham gia
      };
    });

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

const formatGender = (gender) => {
  return gender ? "Nam" : "Nữ";
};

// Lấy danh sách người tham gia của đợt tập trung
export const getConcentrationParticipants = async (req, res) => {
  try {
    const { id } = req.params;
    const participants = await prisma.personOnConcentration.findMany({
      where: {
        concentration_id: parseInt(id),
      },
      include: {
        person: true,
        role: true,
        organization: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Format response với gender đã được format
    const formattedParticipants = participants.map((p) => ({
      ...p,
      person: {
        ...p.person,
        gender: formatGender(p.person.gender),
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
        creator: {
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

    const formattedConcentration = {
      ...concentration,
      team: formatTeamInfo(concentration.team),
      room: MANAGEMENT_ROOMS[concentration.room],
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
      room,
      related_year,
      sequence_number,
      startDate,
      endDate,
      note,
    } = req.body;

    // Validate room
    if (room && !Object.keys(MANAGEMENT_ROOMS).includes(room)) {
      return res.status(400).json({
        success: false,
        message: "Invalid management room",
      });
    }

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

    if (concentration.created_by !== req.user.id) {
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
        room,
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
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Format response
    const formattedConcentration = {
      ...updatedConcentration,
      team: formatTeamInfo(updatedConcentration.team),
      room: MANAGEMENT_ROOMS[updatedConcentration.room],
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

    if (concentration.created_by !== req.user.id) {
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
              assigned_by: req.user.id,
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

    if (concentration.created_by !== req.user.id) {
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

    if (concentration.created_by !== req.user.id) {
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

// Thêm người tham gia vào đợt tập trung
export const addParticipantToConcentration = async (req, res) => {
  try {
    const { id } = req.params;
    const { personId, roleId, organizationId, note } = req.body;

    const participation = await prisma.personOnConcentration.create({
      data: {
        person_id: parseInt(personId),
        concentration_id: parseInt(id),
        role_id: parseInt(roleId),
        organization_id: parseInt(organizationId),
        note: note || "",
        assigned_by: req.user.id,
      },
      include: {
        person: true,
        role: true,
        organization: true,
      },
    });

    // Format gender trước khi trả về
    const formattedParticipation = {
      ...participation,
      person: {
        ...participation.person,
        gender: formatGender(participation.person.gender),
      },
    };

    res.status(201).json({
      success: true,
      message: "Thêm người tham gia thành công",
      data: formattedParticipation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật thông tin tham gia đợt tập trung
export const updateParticipant = async (req, res) => {
  try {
    const { id, participantId } = req.params;
    const { roleId, organizationId, note } = req.body;

    const participation = await prisma.personOnConcentration.update({
      where: {
        id: parseInt(participantId),
        concentration_id: parseInt(id),
      },
      data: {
        role_id: parseInt(roleId),
        organization_id: parseInt(organizationId),
        note,
      },
      include: {
        person: true,
        role: true,
        organization: true,
      },
    });

    // Format gender trước khi trả về
    const formattedParticipation = {
      ...participation,
      person: {
        ...participation.person,
        gender: formatGender(participation.person.gender),
      },
    };

    res.json({
      success: true,
      message: "Cập nhật thông tin tham gia thành công",
      data: formattedParticipation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa người tham gia khỏi đợt tập trung
export const removeParticipant = async (req, res) => {
  try {
    const { id, participantId } = req.params;

    await prisma.personOnConcentration.delete({
      where: {
        id: parseInt(participantId),
        concentration_id: parseInt(id),
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

// Lấy danh sách vắng mặt của một đợt tập trung
export const getAbsencesByConcentration = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra concentration tồn tại
    const concentration = await prisma.concentration.findUnique({
      where: { id: parseInt(id) },
    });

    if (!concentration) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đợt tập trung",
      });
    }

    const absences = await prisma.absenceRecord.findMany({
      where: {
        participation: {
          concentration_id: parseInt(id),
        },
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
      orderBy: [
        {
          participation: {
            person: {
              name: "asc",
            },
          },
        },
        {
          startDate: "asc",
        },
      ],
    });

    // Format gender trong danh sách vắng mặt
    const formattedAbsences = absences.map((absence) => ({
      ...absence,
      participation: {
        ...absence.participation,
        person: {
          ...absence.participation.person,
          gender: formatGender(absence.participation.person.gender),
        },
      },
    }));

    res.json({
      success: true,
      data: formattedAbsences,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Helper function để tính toán số lượng người tham gia
const calculateParticipantStats = async (concentrationId) => {
  const participants = await prisma.personOnConcentration.findMany({
    where: {
      concentration_id: parseInt(concentrationId),
    },
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
  });

  return participants.reduce(
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
};

// API endpoint mới
export const getParticipantStats = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra concentration tồn tại
    const concentration = await prisma.concentration.findUnique({
      where: { id: parseInt(id) },
    });

    if (!concentration) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đợt tập trung",
      });
    }

    const participantStats = await calculateParticipantStats(id);

    res.json({
      success: true,
      data: participantStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Helper function để lấy thời điểm đầu ngày hiện tại
const getStartOfDay = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

// Thêm function mới
export const getRooms = async (req, res) => {
  try {
    const rooms = Object.entries(MANAGEMENT_ROOMS).map(([value, label]) => ({
      value,
      label,
    }));

    res.json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Thêm function mới
export const getAvailablePapers = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, search = "" } = req.query;

    // Build where condition cho search
    const whereCondition = {
      NOT: {
        concentrations: {
          some: {
            concentration_id: parseInt(id),
          },
        },
      },
      ...(search && {
        OR: [
          {
            content: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            publisher: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            number: {
              equals: isNaN(parseInt(search)) ? undefined : parseInt(search),
            },
          },
        ].filter(Boolean),
      }),
    };

    // Đếm tổng số papers thỏa mãn điều kiện
    const total = await prisma.paper.count({
      where: whereCondition,
    });

    // Lấy papers với phân trang
    const papers = await prisma.paper.findMany({
      where: whereCondition,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    res.json({
      success: true,
      data: papers,
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
