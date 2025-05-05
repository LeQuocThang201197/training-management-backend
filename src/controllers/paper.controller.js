import { prisma } from "../config/prisma.js";
import { formatTeamInfo } from "../constants/index.js";
import { uploadFile } from "../config/storage.js";
import { supabase } from "../config/supabase.js";
import { removeVietnameseTones } from "../utils/string.js";

// Thêm function xóa file từ storage
const deleteFileFromStorage = async (filePath) => {
  if (!filePath) return;

  try {
    const { error } = await supabase.storage
      .from("papers")
      .remove([filePath.split("/").pop()]); // Lấy tên file từ đường dẫn

    if (error) throw error;
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

// Tạo văn bản mới
export const createPaper = async (req, res) => {
  try {
    const { number, code, publisher, type, content, related_year, date } =
      req.body;
    const file = req.file;

    // Xử lý tên file tiếng Việt
    let filePath = null;
    if (file) {
      // Chuẩn hóa tên file: bỏ dấu, thay khoảng trắng bằng gạch ngang
      const sanitizedFileName = removeVietnameseTones(file.originalname)
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, "-")
        .replace(/-+/g, "-"); // Thay nhiều gạch ngang liên tiếp thành một

      filePath = `${Date.now()}-${sanitizedFileName}`;
    }

    // Upload file using common function
    let fileData = null;
    if (file) {
      fileData = await uploadFile(file, filePath);
    }

    const newPaper = await prisma.paper.create({
      data: {
        number: parseInt(number),
        code,
        publisher,
        type,
        content,
        related_year: parseInt(related_year),
        date: new Date(date),
        file_name: file?.originalname,
        file_path: fileData?.path,
        created_by: req.user.id,
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: "Tạo văn bản thành công",
      data: newPaper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách văn bản
export const getPapers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "", // Search by content, publisher, or number
      sortBy = "date",
      order = "desc",
    } = req.query;

    // Build where condition
    const where = {
      ...(search && {
        OR: [
          {
            content: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            publisher: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            // Search number as string
            number: {
              equals: isNaN(parseInt(search)) ? undefined : parseInt(search),
            },
          },
          {
            // Also search number as string for partial matches
            number: {
              in: isNaN(parseInt(search))
                ? undefined
                : Array.from({ length: 10 }, (_, i) =>
                    parseInt(search + i.toString())
                  ),
            },
          },
        ].filter(Boolean),
      }),
    };

    // Validate sort order
    const validOrder = ["asc", "desc"].includes(order.toLowerCase())
      ? order.toLowerCase()
      : "desc";

    // Get total count
    const total = await prisma.paper.count({ where });

    // Get papers with pagination and sorting
    const papers = await prisma.paper.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        [sortBy]: validOrder,
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    res.json({
      success: true,
      data: papers,
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
      message: "Server error",
      error: error.message,
    });
  }
};

// Lấy chi tiết văn bản
export const getPaperById = async (req, res) => {
  try {
    const { id } = req.params;
    const paper = await prisma.paper.findUnique({
      where: { id: parseInt(id) },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy văn bản",
      });
    }

    res.json({
      success: true,
      data: paper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật văn bản
export const updatePaper = async (req, res) => {
  try {
    const { id } = req.params;
    const { number, code, publisher, type, content, related_year, date } =
      req.body;
    const file = req.file;

    // Lấy thông tin paper cũ để có file_path
    const oldPaper = await prisma.paper.findUnique({
      where: { id: parseInt(id) },
    });

    // Upload file mới nếu có
    let fileData = null;
    if (file) {
      const filePath = `${Date.now()}-${file.originalname}`;
      fileData = await uploadFile(file, filePath);

      // Xóa file cũ nếu tồn tại
      if (oldPaper.file_path) {
        await deleteFileFromStorage(oldPaper.file_path);
      }
    }

    const updatedPaper = await prisma.paper.update({
      where: { id: parseInt(id) },
      data: {
        number: parseInt(number),
        code,
        publisher,
        type,
        content,
        related_year: parseInt(related_year),
        date: new Date(date),
        ...(fileData && {
          file_name: file.originalname,
          file_path: fileData.path,
        }),
      },
    });

    res.json({
      success: true,
      message: "Cập nhật văn bản thành công",
      data: updatedPaper,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa văn bản
export const deletePaper = async (req, res) => {
  try {
    const { id } = req.params;

    // Lấy thông tin paper để có file_path
    const paper = await prisma.paper.findUnique({
      where: { id: parseInt(id) },
    });

    if (!paper) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy văn bản",
      });
    }

    // Xóa file từ storage nếu có
    if (paper.file_path) {
      await deleteFileFromStorage(paper.file_path);
    }

    // Xóa paper từ database
    await prisma.paper.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Xóa văn bản thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Thêm function để get file
export const getPaperFile = async (req, res) => {
  try {
    const { id } = req.params;
    const paper = await prisma.paper.findUnique({
      where: { id: parseInt(id) },
    });

    if (!paper || !paper.file_path) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy file",
      });
    }

    // Trả về URL trong response
    res.json({
      success: true,
      url: paper.file_path,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách đợt tập trung liên quan đến giấy tờ
export const getConcentrationsByPaper = async (req, res) => {
  try {
    const { id } = req.params;
    const concentrations = await prisma.paperOnConcentration.findMany({
      where: {
        paper_id: parseInt(id),
      },
      include: {
        concentration: {
          include: {
            team: {
              include: {
                sport: true,
              },
            },
            creator: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Format response
    const formattedConcentrations = concentrations.map((poc) => ({
      ...poc.concentration,
      team: formatTeamInfo(poc.concentration.team),
    }));

    res.json({
      success: true,
      data: formattedConcentrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Gỡ bỏ liên kết với concentration
export const detachConcentrationFromPaper = async (req, res) => {
  try {
    const { id, concentrationId } = req.params;

    await prisma.paperOnConcentration.delete({
      where: {
        paper_id_concentration_id: {
          paper_id: parseInt(id),
          concentration_id: parseInt(concentrationId),
        },
      },
    });

    res.json({
      success: true,
      message: "Đã gỡ bỏ liên kết với đợt tập trung",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Gắn concentration vào paper
export const attachConcentrationToPaper = async (req, res) => {
  try {
    const { id } = req.params;
    const { concentrationIds } = req.body; // Mảng các concentration IDs

    const results = await Promise.all(
      concentrationIds.map(async (concentrationId) => {
        try {
          return await prisma.paperOnConcentration.create({
            data: {
              paper_id: parseInt(id),
              concentration_id: parseInt(concentrationId),
              assigned_by: req.user.id,
            },
            include: {
              concentration: {
                include: {
                  team: {
                    include: {
                      sport: true,
                    },
                  },
                  creator: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          });
        } catch (error) {
          return {
            concentrationId,
            error: error.message,
          };
        }
      })
    );

    // Format response
    const formattedResults = results.map((result) => {
      if (result.error) return result;
      return {
        ...result,
        concentration: {
          ...result.concentration,
          team: formatTeamInfo(result.concentration.team),
        },
      };
    });

    res.json({
      success: true,
      message: "Đã gắn đợt tập trung vào văn bản",
      data: formattedResults,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
