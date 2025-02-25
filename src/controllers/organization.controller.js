import { prisma } from "../config/prisma.js";
import pkg from "@prisma/client";

const { OrganizationType } = pkg;

// Định nghĩa labels cho OrganizationType
const ORGANIZATION_TYPE_LABELS = {
  PROVINCE: "Tỉnh/Thành phố",
  OTHER: "Khác",
};

// Lấy danh sách organization (chỉ lấy type OTHER)
export const getOrganizations = async (req, res) => {
  try {
    const organizations = await prisma.organization.findMany({
      where: {
        type: "OTHER",
      },
      orderBy: { name: "asc" },
    });

    const formattedOrganizations = organizations.map((org) => ({
      ...org,
      typeLabel: ORGANIZATION_TYPE_LABELS[org.type],
    }));

    res.json({
      success: true,
      data: formattedOrganizations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách tất cả organization (bao gồm PROVINCE)
export const getAllOrganizations = async (req, res) => {
  try {
    const organizations = await prisma.organization.findMany({
      orderBy: [{ type: "asc" }, { name: "asc" }],
    });

    const formattedOrganizations = organizations.map((org) => ({
      ...org,
      typeLabel: ORGANIZATION_TYPE_LABELS[org.type],
    }));

    res.json({
      success: true,
      data: formattedOrganizations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách OrganizationType enum values
export const getOrganizationTypes = async (req, res) => {
  try {
    const types = Object.values(OrganizationType);

    const formattedTypes = types.map((type) => ({
      value: type,
      label: ORGANIZATION_TYPE_LABELS[type],
    }));

    res.json({
      success: true,
      data: formattedTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Tạo organization mới (chỉ cho type OTHER)
export const createOrganization = async (req, res) => {
  try {
    const { name } = req.body;

    const newOrganization = await prisma.organization.create({
      data: {
        name,
        type: "OTHER",
      },
    });

    res.status(201).json({
      success: true,
      message: "Tạo đơn vị thành công",
      data: newOrganization,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Tên đơn vị đã tồn tại",
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật organization (chỉ cho type OTHER)
export const updateOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const organization = await prisma.organization.findUnique({
      where: { id: parseInt(id) },
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn vị",
      });
    }

    if (organization.type !== "OTHER") {
      return res.status(400).json({
        success: false,
        message: "Không thể sửa thông tin tỉnh/thành phố",
      });
    }

    const updatedOrganization = await prisma.organization.update({
      where: { id: parseInt(id) },
      data: { name },
    });

    res.json({
      success: true,
      message: "Cập nhật đơn vị thành công",
      data: updatedOrganization,
    });
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Tên đơn vị đã tồn tại",
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa organization (chỉ cho type OTHER)
export const deleteOrganization = async (req, res) => {
  try {
    const { id } = req.params;

    const organization = await prisma.organization.findUnique({
      where: { id: parseInt(id) },
    });

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đơn vị",
      });
    }

    if (organization.type !== "OTHER") {
      return res.status(400).json({
        success: false,
        message: "Không thể xóa tỉnh/thành phố",
      });
    }

    await prisma.organization.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Xóa đơn vị thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
