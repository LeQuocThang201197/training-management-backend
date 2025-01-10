import { prisma } from "../config/prisma.js";

export const createTag = async (req, res) => {
  try {
    const { name, color } = req.body;

    // Kiểm tra tag đã tồn tại
    const existingTag = await prisma.tag.findUnique({
      where: { name },
    });

    if (existingTag) {
      return res.status(400).json({
        success: false,
        message: "Tên thẻ đã tồn tại",
      });
    }

    const newTag = await prisma.tag.create({
      data: { name, color },
    });

    res.status(201).json({
      success: true,
      message: "Tạo thẻ thành công",
      data: newTag,
    });
  } catch (error) {
    // Xử lý lỗi Prisma unique constraint
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Tên thẻ đã tồn tại",
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const getTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany();
    res.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const getTagById = async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await prisma.tag.findUnique({
      where: { id: parseInt(id) },
    });
    if (!tag) {
      return res.status(404).json({
        success: false,
        message: "Tag not found",
      });
    }
    res.json({
      success: true,
      data: tag,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export const updateTag = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    // Kiểm tra tên mới có trùng với tag khác không
    const existingTag = await prisma.tag.findFirst({
      where: {
        name,
        NOT: {
          id: parseInt(id),
        },
      },
    });

    if (existingTag) {
      return res.status(400).json({
        success: false,
        message: "Tên thẻ đã tồn tại",
      });
    }

    const updatedTag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: { name, color },
    });

    res.json({
      success: true,
      message: "Cập nhật thẻ thành công",
      data: updatedTag,
    });
  } catch (error) {
    // Xử lý lỗi Prisma unique constraint
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: "Tên thẻ đã tồn tại",
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.tag.delete({
      where: { id: parseInt(id) },
    });
    res.json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
