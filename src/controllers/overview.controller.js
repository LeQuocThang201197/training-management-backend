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

export const getCompetitionStats = async (req, res) => {
  try {
    const now = new Date();

    // Lấy tất cả giải đấu đang diễn ra
    const competitions = await prisma.competition.findMany({
      where: {
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        concentration: {
          include: {
            team: true,
          },
        },
      },
    });

    // Tính tổng số giải đấu
    const total = competitions.length;

    // Group theo location (trong nước/nước ngoài)
    const byLocation = competitions.reduce((acc, comp) => {
      const locationType = comp.isForeign ? "foreign" : "domestic";
      acc[locationType] = (acc[locationType] || 0) + 1;
      return acc;
    }, {});

    // Group theo team type và location
    const byTeamType = competitions.reduce((acc, comp) => {
      const teamType = comp.concentration.team.type;
      const locationType = comp.isForeign ? "foreign" : "domestic";

      if (!acc[teamType]) {
        acc[teamType] = {
          total: 0,
          foreign: 0,
          domestic: 0,
        };
      }

      acc[teamType].total += 1;
      acc[teamType][locationType] += 1;

      return acc;
    }, {});

    res.json({
      success: true,
      data: {
        total,
        byLocation,
        byTeamType,
      },
    });
  } catch (error) {
    console.error("Competition stats error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
