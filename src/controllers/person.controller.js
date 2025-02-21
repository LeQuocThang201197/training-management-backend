import { prisma } from "../config/prisma.js";
import { formatTeamInfo } from "../constants/index.js";

// Tạo person mới
export const createPerson = async (req, res) => {
  try {
    const {
      name,
      code,
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
        code,
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
      code,
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
        code,
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
