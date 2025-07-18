import { prisma } from "../config/prisma.js";

// Lấy thống kê tổng quan
export const getOverviewStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    // Lấy tất cả đợt tập trung đang diễn ra và group theo team type
    const concentrationStats = await prisma.concentration.findMany({
      where: {
        startDate: { lte: endOfDay },
        endDate: { gte: startOfDay },
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
          startDate: { lte: endOfDay },
          endDate: { gte: startOfDay },
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
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    // Lấy tất cả team types từ enum TeamType
    const allTeamTypes = ["ADULT", "JUNIOR", "DISABILITY"]; // Hardcode tạm, sau này có thể lấy từ schema

    // Lấy tất cả giải đấu đang diễn ra
    const competitions = await prisma.competition.findMany({
      where: {
        startDate: { lte: endOfDay },
        endDate: { gte: startOfDay },
      },
      include: {
        concentrations: {
          include: {
            concentration: {
              include: {
                team: true,
              },
            },
          },
        },
      },
    });

    // Tính tổng số giải đấu
    const total = competitions.length;

    // Group theo location (trong nước/nước ngoài)
    const byLocation = {
      domestic: 0,
      foreign: 0,
      ...competitions.reduce((acc, comp) => {
        const locationType = comp.isForeign ? "foreign" : "domestic";
        acc[locationType] = (acc[locationType] || 0) + 1;
        return acc;
      }, {}),
    };

    // Tạo template cho mỗi team type
    const byTeamType = allTeamTypes.reduce((acc, type) => {
      acc[type] = {
        total: 0,
        foreign: 0,
        domestic: 0,
      };
      return acc;
    }, {});

    // Cập nhật số liệu thực tế
    competitions.forEach((comp) => {
      // Lấy team type từ concentration đầu tiên (hoặc có thể tính trung bình nếu cần)
      if (comp.concentrations.length > 0) {
        const teamType = comp.concentrations[0].concentration.team.type;
        const locationType = comp.isForeign ? "foreign" : "domestic";

        byTeamType[teamType].total += 1;
        byTeamType[teamType][locationType] += 1;
      }
    });

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

export const getTrainingStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));
    const allTeamTypes = ["ADULT", "JUNIOR", "DISABILITY"];

    // Lấy tất cả đợt tập huấn đang diễn ra
    const trainings = await prisma.training.findMany({
      where: {
        startDate: { lte: endOfDay },
        endDate: { gte: startOfDay },
      },
      include: {
        concentration: {
          include: {
            team: true,
          },
        },
      },
    });

    // Tính tổng số đợt tập huấn
    const total = trainings.length;

    // Group theo location (trong nước/nước ngoài)
    const byLocation = {
      domestic: 0,
      foreign: 0,
      ...trainings.reduce((acc, training) => {
        const locationType = training.isForeign ? "foreign" : "domestic";
        acc[locationType] = (acc[locationType] || 0) + 1;
        return acc;
      }, {}),
    };

    // Tạo template cho mỗi team type
    const byTeamType = allTeamTypes.reduce((acc, type) => {
      acc[type] = {
        total: 0,
        foreign: 0,
        domestic: 0,
      };
      return acc;
    }, {});

    // Cập nhật số liệu thực tế
    trainings.forEach((training) => {
      const teamType = training.concentration.team.type;
      const locationType = training.isForeign ? "foreign" : "domestic";

      byTeamType[teamType].total += 1;
      byTeamType[teamType][locationType] += 1;
    });

    res.json({
      success: true,
      data: {
        total,
        byLocation,
        byTeamType,
      },
    });
  } catch (error) {
    console.error("Training stats error:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
