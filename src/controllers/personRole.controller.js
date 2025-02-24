import { prisma } from "../config/prisma.js";

// Tạo role mới
export const createPersonRole = async (req, res) => {
  try {
    const { name, type } = req.body;

    const newRole = await prisma.personRole.create({
      data: {
        name,
        type,
      },
    });

    res.status(201).json({
      success: true,
      message: "Tạo vai trò thành công",
      data: newRole,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách role
export const getPersonRoles = async (req, res) => {
  try {
    const roles = await prisma.personRole.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json({
      success: true,
      data: roles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy chi tiết role
export const getPersonRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await prisma.personRole.findUnique({
      where: { id: parseInt(id) },
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy vai trò",
      });
    }

    res.json({
      success: true,
      data: role,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật role
export const updatePersonRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type } = req.body;

    const updatedRole = await prisma.personRole.update({
      where: { id: parseInt(id) },
      data: {
        name,
        type,
      },
    });

    res.json({
      success: true,
      message: "Cập nhật vai trò thành công",
      data: updatedRole,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa role
export const deletePersonRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Kiểm tra xem role có đang được sử dụng không
    const usedRole = await prisma.personOnConcentration.findFirst({
      where: { role_id: parseInt(id) },
    });

    if (usedRole) {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa vai trò đang được sử dụng",
      });
    }

    await prisma.personRole.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Xóa vai trò thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
