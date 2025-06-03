import { prisma } from "../config/prisma.js";
import { formatTeamInfo } from "../constants/index.js";
import { uploadFile } from "../config/storage.js";
import { supabase } from "../config/supabase.js";

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

    // Upload file using common function - để storage.js xử lý tên file
    let fileData = null;
    if (file) {
      fileData = await uploadFile(file); // Không cần truyền filePath nữa
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

// Cập nhật thông tin văn bản
export const updatePaperInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { number, code, publisher, type, content, related_year, date } =
      req.body;

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
      },
    });

    res.json({
      success: true,
      message: "Cập nhật thông tin văn bản thành công",
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

// Cập nhật file đính kèm
export const updatePaperFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Không tìm thấy file đính kèm",
      });
    }

    // Lấy thông tin paper cũ
    const oldPaper = await prisma.paper.findUnique({
      where: { id: parseInt(id) },
    });

    // Upload file mới
    const fileData = await uploadFile(file);

    // Xóa file cũ nếu có
    if (oldPaper.file_path) {
      await deleteFileFromStorage(oldPaper.file_path);
    }

    // Cập nhật thông tin file
    const updatedPaper = await prisma.paper.update({
      where: { id: parseInt(id) },
      data: {
        file_name: file.originalname,
        file_path: fileData.path,
      },
    });

    res.json({
      success: true,
      message: "Cập nhật file đính kèm thành công",
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
      fileName: paper.file_name,
      type: "preview",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cải thiện endpoint download để tạo signed URL
export const downloadPaperFile = async (req, res) => {
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

    // Tạo signed URL với header Content-Disposition để force download
    const fileName = paper.file_path.split("/").pop();
    const { data, error } = await supabase.storage
      .from("papers")
      .createSignedUrl(fileName, 60, {
        download: paper.file_name || fileName, // Tên file khi download
      });

    if (error) {
      throw error;
    }

    res.json({
      success: true,
      downloadUrl: data.signedUrl,
      fileName: paper.file_name,
      type: "download",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo link tải file",
      error: error.message,
    });
  }
};

// Helper function để xác định MIME type
const getMimeType = (extension) => {
  const mimeTypes = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    txt: "text/plain",
  };
  return mimeTypes[extension] || "application/octet-stream";
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
