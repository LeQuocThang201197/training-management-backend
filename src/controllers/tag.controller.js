import { prisma } from "../config/prisma.js";

export const createTag = async (req, res) => {
  try {
    const { name, color } = req.body;
    const newTag = await prisma.tag.create({
      data: { name, color },
    });
    res.status(201).json({
      success: true,
      message: "Tag created successfully",
      data: newTag,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
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
    const updatedTag = await prisma.tag.update({
      where: { id: parseInt(id) },
      data: { name, color },
    });
    res.json({
      success: true,
      message: "Tag updated successfully",
      data: updatedTag,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
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
