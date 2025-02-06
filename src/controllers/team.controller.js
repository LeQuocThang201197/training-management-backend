import pkg from "@prisma/client";
import { prisma } from "../config/prisma.js";

// Lấy các enum từ PrismaClient
const { TeamType, ManagementRoom, TeamGender } = pkg;

// Lấy danh sách enum values
export const getEnumValues = async (req, res) => {
  try {
    const typeLabels = {
      JUNIOR: "Trẻ",
      ADULT: "Tuyển",
      DISABILITY: "Người khuyết tật",
    };

    const roomLabels = {
      ROOM_1: "Vụ 1",
      ROOM_2: "Vụ 2",
      ROOM_3: "Thể thao cho mọi người",
    };

    const genderLabels = {
      MALE: "Nam",
      FEMALE: "Nữ",
      MIXED: "Cả nam và nữ",
    };

    const types = Object.values(TeamType).map((value) => ({
      value,
      label: typeLabels[value],
    }));

    const rooms = Object.values(ManagementRoom).map((value) => ({
      value,
      label: roomLabels[value],
    }));

    const genders = Object.values(TeamGender).map((value) => ({
      value,
      label: genderLabels[value],
    }));

    res.json({
      success: true,
      data: {
        types,
        rooms,
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
    const { sportId, type, room, gender } = req.body;

    const newTeam = await prisma.team.create({
      data: {
        sportId: parseInt(sportId),
        type,
        room,
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

    // Map các giá trị enum sang tiếng Việt
    const typeLabels = {
      JUNIOR: "Trẻ",
      ADULT: "Tuyển",
      DISABILITY: "Người khuyết tật",
    };

    const roomLabels = {
      ROOM_1: "Vụ 1",
      ROOM_2: "Vụ 2",
      ROOM_3: "Thể thao cho mọi người",
    };

    const genderLabels = {
      MALE: "Nam",
      FEMALE: "Nữ",
      MIXED: "Cả nam và nữ",
    };

    // Transform data trước khi trả về
    const transformedTeams = teams.map((team) => ({
      id: team.id,
      sport: team.sport.name,
      type: typeLabels[team.type],
      room: roomLabels[team.room],
      gender: genderLabels[team.gender],
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      // Giữ lại raw data cho frontend nếu cần
      rawData: {
        sportId: team.sportId,
        type: team.type,
        room: team.room,
        gender: team.gender,
      },
    }));

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
    const { sportId, type, room, gender } = req.body;

    const updatedTeam = await prisma.team.update({
      where: { id: parseInt(id) },
      data: {
        sportId: parseInt(sportId),
        type,
        room,
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
