import { prisma } from "../config/prisma.js";
import { formatTeamInfo } from "../constants/index.js";

// Tạo person mới
export const createPerson = async (req, res) => {
  try {
    const {
      name,
      identity_number,
      identity_date,
      identity_place,
      social_insurance,
      birthday,
      gender,
      phone,
      email,
    } = req.body;

    const newPerson = await prisma.person.create({
      data: {
        name,
        identity_number,
        identity_date: identity_date ? new Date(identity_date) : null,
        identity_place,
        social_insurance,
        birthday: birthday ? new Date(birthday) : null,
        gender,
        phone,
        email,
      },
    });

    res.status(201).json({
      success: true,
      message: "Tạo thông tin cá nhân thành công",
      data: newPerson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách person
export const getPersons = async (req, res) => {
  try {
    const persons = await prisma.person.findMany({
      orderBy: {
        name: "asc",
      },
    });

    res.json({
      success: true,
      data: persons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy chi tiết person
export const getPersonById = async (req, res) => {
  try {
    const { id } = req.params;
    const person = await prisma.person.findUnique({
      where: { id: parseInt(id) },
    });

    if (!person) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin cá nhân",
      });
    }

    res.json({
      success: true,
      data: person,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật person
export const updatePerson = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      identity_number,
      identity_date,
      identity_place,
      social_insurance,
      birthday,
      gender,
      phone,
      email,
    } = req.body;

    const updatedPerson = await prisma.person.update({
      where: { id: parseInt(id) },
      data: {
        name,
        identity_number,
        identity_date: identity_date ? new Date(identity_date) : null,
        identity_place,
        social_insurance,
        birthday: birthday ? new Date(birthday) : null,
        gender,
        phone,
        email,
      },
    });

    res.json({
      success: true,
      message: "Cập nhật thông tin cá nhân thành công",
      data: updatedPerson,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Xóa person
export const deletePerson = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.person.delete({
      where: { id: parseInt(id) },
    });

    res.json({
      success: true,
      message: "Xóa thông tin cá nhân thành công",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy lịch sử tham gia của person
export const getPersonParticipations = async (req, res) => {
  try {
    const { id } = req.params;
    const participations = await prisma.personOnConcentration.findMany({
      where: {
        person_id: parseInt(id),
      },
      include: {
        concentration: {
          include: {
            team: {
              include: {
                sport: true,
              },
            },
          },
        },
        role: true,
        affiliation: true,
      },
      orderBy: {
        startDate: "desc",
      },
    });

    // Format response
    const formattedParticipations = participations.map((p) => ({
      ...p,
      concentration: {
        ...p.concentration,
        team: formatTeamInfo(p.concentration.team),
      },
    }));

    res.json({
      success: true,
      data: formattedParticipations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Thêm person vào concentration
export const attachPersonToConcentration = async (req, res) => {
  try {
    const { id } = req.params; // person_id
    const {
      concentration_id,
      role_id,
      affiliation_id,
      startDate,
      endDate,
      note,
    } = req.body;

    // Kiểm tra concentration tồn tại
    const concentration = await prisma.concentration.findUnique({
      where: { id: parseInt(concentration_id) },
    });

    if (!concentration) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đợt tập trung",
      });
    }

    // Tạo liên kết
    const participation = await prisma.personOnConcentration.create({
      data: {
        person_id: parseInt(id),
        concentration_id: parseInt(concentration_id),
        role_id: parseInt(role_id),
        affiliation_id: parseInt(affiliation_id),
        startDate: startDate ? new Date(startDate) : concentration.startDate,
        endDate: endDate ? new Date(endDate) : concentration.endDate,
        note,
        assignedBy: req.user.id,
      },
      include: {
        concentration: {
          include: {
            team: {
              include: {
                sport: true,
              },
            },
          },
        },
        role: true,
        affiliation: true,
      },
    });

    // Format response
    const formattedParticipation = {
      ...participation,
      concentration: {
        ...participation.concentration,
        team: formatTeamInfo(participation.concentration.team),
      },
    };

    res.status(201).json({
      success: true,
      message: "Thêm người tham gia thành công",
      data: formattedParticipation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Cập nhật thông tin tham gia
export const updatePersonParticipation = async (req, res) => {
  try {
    const { id, participationId } = req.params;
    const { role_id, affiliation_id, startDate, endDate, note } = req.body;

    const participation = await prisma.personOnConcentration.update({
      where: {
        id: parseInt(participationId),
        person_id: parseInt(id),
      },
      data: {
        role_id: parseInt(role_id),
        affiliation_id: parseInt(affiliation_id),
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        note,
      },
      include: {
        concentration: {
          include: {
            team: {
              include: {
                sport: true,
              },
            },
          },
        },
        role: true,
        affiliation: true,
      },
    });

    // Format response
    const formattedParticipation = {
      ...participation,
      concentration: {
        ...participation.concentration,
        team: formatTeamInfo(participation.concentration.team),
      },
    };

    res.json({
      success: true,
      message: "Cập nhật thông tin tham gia thành công",
      data: formattedParticipation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Tìm kiếm person theo tên
export const getPersonsByName = async (req, res) => {
  try {
    const { q } = req.query; // q là search query từ client

    if (!q) {
      return res.json({
        success: true,
        data: [],
      });
    }

    const persons = await prisma.person.findMany({
      where: {
        name: {
          contains: q,
          mode: "insensitive", // Tìm kiếm không phân biệt hoa thường
        },
      },
      orderBy: {
        name: "asc",
      },
      take: 10, // Giới hạn số lượng kết quả
    });

    res.json({
      success: true,
      data: persons,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};
