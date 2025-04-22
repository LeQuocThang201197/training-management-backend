import { prisma } from "../config/prisma.js";

// Lấy thống kê tổng quan
export const getOverviewStats = async (req, res) => {
  try {
    const now = new Date();

    // Lấy tất cả đợt tập trung đang diễn ra và group theo team type
    const concentrationStats = await prisma.concentration.findMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        team: true,
      },
    });

    // Group theo team type
    const concentrationsByTeamType = concentrationStats.reduce((acc, con) => {
      const teamType = con.team.type;
      acc[teamType] = (acc[teamType] || 0) + 1;
      return acc;
    }, {});

    // Tính tổng số đợt tập trung
    const totalConcentrations = concentrationStats.length;

    // Lấy số người tham gia theo role và team type
    const participantStats = await prisma.personOnConcentration.findMany({
      where: {
        concentration: {
          startDate: { lte: now },
          endDate: { gte: now },
        },
      },
      include: {
        role: true,
        concentration: {
          include: {
            team: true,
          },
        },
      },
    });

    // Group theo role và team type
    const participantsByRole = participantStats.reduce((acc, p) => {
      const roleType = p.role.type;
      acc[roleType] = (acc[roleType] || 0) + 1;
      return acc;
    }, {});

    const participantsByTeamAndRole = participantStats.reduce((acc, p) => {
      const teamType = p.concentration.team.type;
      const roleType = p.role.type;

      if (!acc[teamType]) {
        acc[teamType] = {};
      }
      acc[teamType][roleType] = (acc[teamType][roleType] || 0) + 1;
      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        concentrations: {
          total: totalConcentrations,
          byTeamType: concentrationsByTeamType,
        },
        participants: {
          total: participantsByRole,
          byTeamType: participantsByTeamAndRole,
        },
      },
    });
  } catch (error) {
    console.error("Overview stats error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Thống kê theo loại đội
export const getTeamStats = async (req, res) => {
  try {
    const now = new Date();

    // Đếm số đợt tập trung theo loại đội
    const teamStats = await prisma.concentration.groupBy({
      by: ["team.type"],
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
      },
      _count: true,
      orderBy: {
        _count: "desc",
      },
    });

    res.json({
      success: true,
      data: teamStats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Thống kê người tham gia theo vai trò
export const getParticipantStats = async (req, res) => {
  try {
    const now = new Date();

    // Đếm số người tham gia theo vai trò
    const participantStats = await prisma.personOnConcentration.groupBy({
      by: ["role.type"],
      where: {
        concentration: {
          startDate: { lte: now },
          endDate: { gte: now },
        },
      },
      _count: true,
    });

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

// Thống kê hoạt động (tập huấn, thi đấu)
export const getActivityStats = async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    // Đếm số hoạt động trong 30 ngày qua
    const [trainings, competitions] = await Promise.all([
      prisma.training.count({
        where: {
          startDate: { gte: thirtyDaysAgo },
        },
      }),
      prisma.competition.count({
        where: {
          startDate: { gte: thirtyDaysAgo },
        },
      }),
    ]);

    res.json({
      success: true,
      data: {
        last30Days: {
          trainings,
          competitions,
        },
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
