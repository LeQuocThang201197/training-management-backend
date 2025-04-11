import pkg from "@prisma/client";
import { prisma } from "../config/prisma.js";
import { TEAM_LABELS, formatTeamInfo } from "../constants/index.js";

// Lấy các enum từ PrismaClient
const { TeamType, TeamGender } = pkg;

// Lấy danh sách enum values
export const getEnumValues = async (req, res) => {
  try {
    const types = Object.entries(TEAM_LABELS.type).map(([value, label]) => ({
      value,
      label,
    }));

    const genders = Object.entries(TEAM_LABELS.gender).map(
      ([value, label]) => ({
        value,
        label,
      })
    );

    res.json({
      success: true,
      data: {
        types,
        genders,
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

// Tạo team mới
export const createTeam = async (req, res) => {
  try {
    const { sportId, type, gender } = req.body;

    const newTeam = await prisma.team.create({
      data: {
        sportId: parseInt(sportId),
        type,
        gender,
      },
      include: {
        sport: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Tạo đội thành công",
      data: newTeam,
    });
  } catch (error) {
    // Xử lý lỗi unique constraint
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Đội này đã tồn tại",
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách team
export const getTeams = async (req, res) => {
  try {
    const teams = await prisma.team.findMany({
      include: {
        sport: true,
      },
    });

    const transformedTeams = teams.map(formatTeamInfo);

    res.json({
      success: true,
      data: transformedTeams,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật team
export const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { sportId, type, gender } = req.body;

    const updatedTeam = await prisma.team.update({
      where: { id: parseInt(id) },
      data: {
        sportId: parseInt(sportId),
        type,
        gender,
      },
      include: {
        sport: true,
      },
    });

    res.json({
      success: true,
      message: "Cập nhật đội thành công",
      data: updatedTeam,
    });
  } catch (error) {
    // Xử lý lỗi unique constraint
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Đội này đã tồn tại",
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa team
export const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.team.delete({
      where: { id: parseInt(id) },
    });
    res.json({
      success: true,
      message: "Xóa đội thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
