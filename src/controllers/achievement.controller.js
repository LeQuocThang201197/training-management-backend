import { prisma } from "../config/prisma.js";
import { formatTeamInfo, MANAGEMENT_ROOMS } from "../constants/index.js";

const formatGender = (gender) => {
  return gender ? "Nam" : "Nữ";
};

// Tạo thành tích mới
export const createAchievement = async (req, res) => {
  try {
    const {
      person_id,
      competition_id,
      event_name,
      event_category,
      result_value,
      result_unit,
      medal_type,
      rank,
      note,
      is_record,
    } = req.body;

    // Kiểm tra person tồn tại
    const person = await prisma.person.findUnique({
      where: { id: parseInt(person_id) },
      select: { id: true, name: true },
    });

    if (!person) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy vận động viên",
      });
    }

    // Kiểm tra competition tồn tại
    const competition = await prisma.competition.findUnique({
      where: { id: parseInt(competition_id) },
      select: { id: true, name: true },
    });

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giải đấu",
      });
    }

    const achievement = await prisma.achievement.create({
      data: {
        person_id: parseInt(person_id),
        competition_id: parseInt(competition_id),
        event_name: event_name.trim(),
        event_category: event_category?.trim() || null,
        result_value: result_value.trim(),
        result_unit: result_unit.trim(),
        medal_type: medal_type?.trim() || null,
        rank: rank ? parseInt(rank) : null,
        note: note?.trim() || null,
        is_record: is_record || false,
        created_by: req.user.id,
      },
      include: {
        person: {
          select: { id: true, name: true, gender: true },
        },
        competition: {
          select: {
            id: true,
            name: true,
            location: true,
            startDate: true,
            endDate: true,
          },
        },
        creator: {
          select: { id: true, name: true },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Tạo thành tích thành công",
      data: {
        ...achievement,
        person: {
          ...achievement.person,
          gender: formatGender(achievement.person.gender),
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

// Lấy danh sách thành tích với phân trang, tìm kiếm và lọc
export const getAchievements = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      sortBy = "createdAt",
      sortOrder = "desc",
      person_id,
      competition_id,
      event_name,
      medal_type,
      is_record,
    } = req.query;

    // Build where condition
    const whereCondition = {
      ...(search && {
        OR: [
          {
            event_name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            person: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
          {
            competition: {
              name: {
                contains: search,
                mode: "insensitive",
              },
            },
          },
        ],
      }),
      ...(person_id && { person_id: parseInt(person_id) }),
      ...(competition_id && { competition_id: parseInt(competition_id) }),
      ...(event_name && {
        event_name: {
          contains: event_name,
          mode: "insensitive",
        },
      }),
      ...(medal_type && { medal_type }),
      ...(is_record !== undefined && { is_record: is_record === "true" }),
    };

    // Count total
    const total = await prisma.achievement.count({ where: whereCondition });

    // Get achievements with pagination
    const achievements = await prisma.achievement.findMany({
      where: whereCondition,
      include: {
        person: {
          select: { id: true, name: true, gender: true },
        },
        competition: {
          select: {
            id: true,
            name: true,
            location: true,
            startDate: true,
            endDate: true,
          },
        },
        creator: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    // Format response
    const formattedAchievements = achievements.map((achievement) => ({
      ...achievement,
      person: {
        ...achievement.person,
        gender: formatGender(achievement.person.gender),
      },
    }));

    res.json({
      success: true,
      data: formattedAchievements,
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

// Lấy chi tiết thành tích theo ID
export const getAchievementById = async (req, res) => {
  try {
    const { id } = req.params;

    const achievement = await prisma.achievement.findUnique({
      where: { id: parseInt(id) },
      include: {
        person: {
          select: { id: true, name: true, gender: true },
        },
        competition: {
          select: {
            id: true,
            name: true,
            location: true,
            startDate: true,
            endDate: true,
          },
        },
        creator: {
          select: { id: true, name: true },
        },
      },
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thành tích",
      });
    }

    res.json({
      success: true,
      data: {
        ...achievement,
        person: {
          ...achievement.person,
          gender: formatGender(achievement.person.gender),
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

// Cập nhật thành tích
export const updateAchievement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      event_name,
      event_category,
      result_value,
      result_unit,
      medal_type,
      rank,
      note,
      is_record,
    } = req.body;

    const achievement = await prisma.achievement.update({
      where: { id: parseInt(id) },
      data: {
        event_name: event_name.trim(),
        event_category: event_category?.trim() || null,
        result_value: result_value.trim(),
        result_unit: result_unit.trim(),
        medal_type: medal_type?.trim() || null,
        rank: rank ? parseInt(rank) : null,
        note: note?.trim() || null,
        is_record: is_record || false,
      },
      include: {
        person: {
          select: { id: true, name: true, gender: true },
        },
        competition: {
          select: {
            id: true,
            name: true,
            location: true,
            startDate: true,
            endDate: true,
          },
        },
        creator: {
          select: { id: true, name: true },
        },
      },
    });

    res.json({
      success: true,
      message: "Cập nhật thành tích thành công",
      data: {
        ...achievement,
        person: {
          ...achievement.person,
          gender: formatGender(achievement.person.gender),
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

// Xóa thành tích
export const deleteAchievement = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra achievement tồn tại
    const achievement = await prisma.achievement.findUnique({
      where: { id: parseInt(id) },
    });

    if (!achievement) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thành tích",
      });
    }

    await prisma.achievement.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Xóa thành tích thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách thành tích của một vận động viên
export const getAchievementsByPerson = async (req, res) => {
  try {
    const { personId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Kiểm tra person tồn tại
    const person = await prisma.person.findUnique({
      where: { id: parseInt(personId) },
      select: { id: true, name: true, gender: true },
    });

    if (!person) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy vận động viên",
      });
    }

    // Count total
    const total = await prisma.achievement.count({
      where: { person_id: parseInt(personId) },
    });

    // Get achievements
    const achievements = await prisma.achievement.findMany({
      where: { person_id: parseInt(personId) },
      include: {
        competition: {
          select: {
            id: true,
            name: true,
            location: true,
            startDate: true,
            endDate: true,
          },
        },
        creator: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    res.json({
      success: true,
      data: {
        person: {
          ...person,
          gender: formatGender(person.gender),
        },
        achievements,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
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

// Lấy danh sách thành tích của một giải đấu
export const getAchievementsByCompetition = async (req, res) => {
  try {
    const { competitionId } = req.params;
    const {
      page = 1,
      limit = 10,
      sortBy = "rank",
      sortOrder = "asc",
    } = req.query;

    // Kiểm tra competition tồn tại
    const competition = await prisma.competition.findUnique({
      where: { id: parseInt(competitionId) },
      select: {
        id: true,
        name: true,
        location: true,
        startDate: true,
        endDate: true,
      },
    });

    if (!competition) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy giải đấu",
      });
    }

    // Count total
    const total = await prisma.achievement.count({
      where: { competition_id: parseInt(competitionId) },
    });

    // Get achievements
    const achievements = await prisma.achievement.findMany({
      where: { competition_id: parseInt(competitionId) },
      include: {
        person: {
          select: { id: true, name: true, gender: true },
        },
        creator: {
          select: { id: true, name: true },
        },
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    // Format response
    const formattedAchievements = achievements.map((achievement) => ({
      ...achievement,
      person: {
        ...achievement.person,
        gender: formatGender(achievement.person.gender),
      },
    }));

    res.json({
      success: true,
      data: {
        competition,
        achievements: formattedAchievements,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          totalPages: Math.ceil(total / parseInt(limit)),
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

// Lấy thống kê thành tích
export const getAchievementStats = async (req, res) => {
  try {
    // Tổng số thành tích
    const totalAchievements = await prisma.achievement.count();

    // Số thành tích theo huy chương
    const medalStats = await prisma.achievement.groupBy({
      by: ["medal_type"],
      _count: {
        medal_type: true,
      },
      where: {
        medal_type: {
          not: null,
        },
      },
    });

    // Số kỷ lục
    const totalRecords = await prisma.achievement.count({
      where: { is_record: true },
    });

    // Top 5 vận động viên có nhiều thành tích nhất
    const topAthletes = await prisma.achievement.groupBy({
      by: ["person_id"],
      _count: {
        person_id: true,
      },
      orderBy: {
        _count: {
          person_id: "desc",
        },
      },
      take: 5,
    });

    // Lấy thông tin chi tiết của top athletes
    const topAthletesDetails = await Promise.all(
      topAthletes.map(async (athlete) => {
        const person = await prisma.person.findUnique({
          where: { id: athlete.person_id },
          select: { id: true, name: true, gender: true },
        });
        return {
          ...person,
          gender: formatGender(person.gender),
          achievementCount: athlete._count.person_id,
        };
      })
    );

    // Số thành tích theo sự kiện
    const eventStats = await prisma.achievement.groupBy({
      by: ["event_name"],
      _count: {
        event_name: true,
      },
      orderBy: {
        _count: {
          event_name: "desc",
        },
      },
      take: 10,
    });

    res.json({
      success: true,
      data: {
        totalAchievements,
        medalStats: medalStats.map((stat) => ({
          medal_type: stat.medal_type,
          count: stat._count.medal_type,
        })),
        totalRecords,
        topAthletes: topAthletesDetails,
        topEvents: eventStats.map((stat) => ({
          event_name: stat.event_name,
          count: stat._count.event_name,
        })),
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
