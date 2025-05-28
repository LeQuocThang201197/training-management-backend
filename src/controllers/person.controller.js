import { prisma } from "../config/prisma.js";
import { formatTeamInfo } from "../constants/index.js";

// Hàm format giới tính
const formatGender = (gender) => {
  return gender ? "Nam" : "Nữ";
};

// Helper function to normalize empty values to null and trim whitespace
const normalizeEmptyToNull = (value) => {
  if (value === undefined || value === null) {
    return null;
  }
  // Trim whitespace if it's a string
  if (typeof value === "string") {
    const normalized = value.trim().replace(/\s+/g, " ");
    return normalized === "" ? null : normalized;
  }
  return value;
};

// Helper function để chuẩn hóa text search
const normalizeSearchText = (text) => {
  if (!text) return null;
  // Chuyển về chữ thường và bỏ dấu
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};

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

    // Normalize values
    const normalizedIdentityNumber = normalizeEmptyToNull(identity_number);
    const normalizedSocialInsurance = normalizeEmptyToNull(social_insurance);

    // Check if identity_number already exists
    if (normalizedIdentityNumber) {
      const existingPerson = await prisma.person.findFirst({
        where: { identity_number: normalizedIdentityNumber },
      });
      if (existingPerson) {
        return res.status(400).json({
          success: false,
          message: "Số CCCD/CMND đã tồn tại",
        });
      }
    }

    // Check if social_insurance already exists
    if (normalizedSocialInsurance) {
      const existingPerson = await prisma.person.findFirst({
        where: { social_insurance: normalizedSocialInsurance },
      });
      if (existingPerson) {
        return res.status(400).json({
          success: false,
          message: "Số BHXH đã tồn tại",
        });
      }
    }

    const newPerson = await prisma.person.create({
      data: {
        name: normalizeEmptyToNull(name),
        name_search: normalizeSearchText(name),
        identity_number: normalizedIdentityNumber,
        identity_date: identity_date ? new Date(identity_date) : null,
        identity_place: normalizeEmptyToNull(identity_place),
        social_insurance: normalizedSocialInsurance,
        birthday: birthday ? new Date(birthday) : null,
        gender: gender === "Nam",
        phone: normalizeEmptyToNull(phone),
        email: normalizeEmptyToNull(email),
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
      message: "Tạo thông tin cá nhân thành công",
      data: {
        ...newPerson,
        gender: formatGender(newPerson.gender),
      },
    });
  } catch (error) {
    // Handle Prisma unique constraint error
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: `${
          error.meta.target[0] === "identity_number"
            ? "Số CCCD/CMND"
            : "Số BHXH"
        } đã tồn tại`,
      });
    }
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
};

// Lấy danh sách person với phân trang, tìm kiếm và sắp xếp
export const getPersons = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      q = "", // Query parameter cho tìm kiếm
      sortBy = "name",
      order = "asc",
    } = req.query;

    // Xây dựng điều kiện where
    const where = {
      ...(q && {
        name_search: {
          contains: normalizeSearchText(q),
          mode: "insensitive",
        },
      }),
    };

    // Đếm tổng số bản ghi thỏa mãn điều kiện
    const total = await prisma.person.count({ where });

    // Lấy danh sách theo phân trang và sắp xếp
    const persons = await prisma.person.findMany({
      where,
      include: {
        participations: {
          orderBy: {
            concentration: {
              endDate: "desc", // Sắp xếp participation theo ngày kết thúc giảm dần
            },
          },
          take: 1, // Chỉ lấy participation mới nhất
          include: {
            concentration: {
              include: {
                team: {
                  include: { sport: true },
                },
              },
            },
            role: true,
          },
        },
      },
      orderBy: {
        [sortBy]: order.toLowerCase(), // Giữ nguyên cách sắp xếp persons
      },
      skip: (parseInt(page) - 1) * parseInt(limit),
      take: parseInt(limit),
    });

    // Format response với đầy đủ thông tin
    const formattedPersons = persons.map((person) => {
      const latestParticipation = person.participations[0];

      return {
        ...person,
        gender: formatGender(person.gender),
        latest_participation: latestParticipation
          ? {
              role: latestParticipation.role.name,
              sport: latestParticipation.concentration.team.sport.name,
              team: {
                type: formatTeamType(
                  latestParticipation.concentration.team.type
                ),
                gender: formatTeamGender(
                  latestParticipation.concentration.team.gender
                ),
              },
              concentration: {
                id: latestParticipation.concentration.id,
                location: latestParticipation.concentration.location,
                startDate: latestParticipation.concentration.startDate,
                endDate: latestParticipation.concentration.endDate,
              },
            }
          : null,
        participations: undefined, // Không trả về danh sách participations
      };
    });

    res.json({
      success: true,
      data: formattedPersons,
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
      include: {
        creator: {
          select: {
            id: true,
            name: true,
          },
        },
        participations: {
          include: {
            // Include concentration basic info
            concentration: {
              include: {
                team: {
                  include: {
                    sport: true,
                  },
                },
              },
            },
            // Include role and organization
            role: true,
            organization: true,
            // Include only the trainings this person participated in
            trainingParticipations: {
              include: {
                training: true,
              },
              orderBy: {
                training: {
                  startDate: "desc",
                },
              },
            },
            // Include only the competitions this person participated in
            competitionParticipations: {
              include: {
                competition: true,
              },
              orderBy: {
                competition: {
                  startDate: "desc",
                },
              },
            },
          },
          orderBy: {
            concentration: {
              startDate: "desc",
            },
          },
        },
      },
    });

    if (!person) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin cá nhân",
      });
    }

    // Format response
    const formattedPerson = {
      ...person,
      gender: formatGender(person.gender),
      creator: person.creator,
      participations: person.participations.map((p) => ({
        id: p.id,
        role: {
          name: p.role.name,
          type: p.role.type,
        },
        organization: {
          name: p.organization.name,
          type: p.organization.type,
        },
        concentration: {
          id: p.concentration.id,
          location: p.concentration.location,
          startDate: p.concentration.startDate,
          endDate: p.concentration.endDate,
          team: {
            sport: p.concentration.team.sport.name,
            type: formatTeamType(p.concentration.team.type),
            gender: formatTeamGender(p.concentration.team.gender),
          },
          // Move trainings inside concentration
          trainings: p.trainingParticipations.map((tp) => ({
            id: tp.training.id,
            location: tp.training.location,
            startDate: tp.training.startDate,
            endDate: tp.training.endDate,
            isForeign: tp.training.isForeign,
            note: tp.note || null,
          })),
          // Move competitions inside concentration
          competitions: p.competitionParticipations.map((cp) => ({
            id: cp.competition.id,
            name: cp.competition.name,
            location: cp.competition.location,
            startDate: cp.startDate,
            endDate: cp.endDate,
            isForeign: cp.competition.isForeign,
            is_confirmed: cp.competition.is_confirmed,
            note: cp.note || null,
          })),
        },
      })),
    };

    res.json({
      success: true,
      data: formattedPerson,
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

    // Normalize values
    const normalizedIdentityNumber = normalizeEmptyToNull(identity_number);
    const normalizedSocialInsurance = normalizeEmptyToNull(social_insurance);

    // Check if identity_number already exists (excluding current person)
    if (normalizedIdentityNumber) {
      const existingPerson = await prisma.person.findFirst({
        where: {
          identity_number: normalizedIdentityNumber,
          NOT: {
            id: parseInt(id),
          },
        },
      });
      if (existingPerson) {
        return res.status(400).json({
          success: false,
          message: "Số CCCD/CMND đã tồn tại",
        });
      }
    }

    // Check if social_insurance already exists (excluding current person)
    if (normalizedSocialInsurance) {
      const existingPerson = await prisma.person.findFirst({
        where: {
          social_insurance: normalizedSocialInsurance,
          NOT: {
            id: parseInt(id),
          },
        },
      });
      if (existingPerson) {
        return res.status(400).json({
          success: false,
          message: "Số BHXH đã tồn tại",
        });
      }
    }

    const updatedPerson = await prisma.person.update({
      where: { id: parseInt(id) },
      data: {
        name: normalizeEmptyToNull(name),
        name_search: normalizeSearchText(name),
        identity_number: normalizedIdentityNumber,
        identity_date: identity_date ? new Date(identity_date) : null,
        identity_place: normalizeEmptyToNull(identity_place),
        social_insurance: normalizedSocialInsurance,
        birthday: birthday ? new Date(birthday) : null,
        gender: gender === "Nam",
        phone: normalizeEmptyToNull(phone),
        email: normalizeEmptyToNull(email),
      },
    });

    res.json({
      success: true,
      message: "Cập nhật thông tin cá nhân thành công",
      data: {
        ...updatedPerson,
        gender: formatGender(updatedPerson.gender),
      },
    });
  } catch (error) {
    // Handle Prisma unique constraint error
    if (error.code === "P2002") {
      return res.status(400).json({
        success: false,
        message: `${
          error.meta.target[0] === "identity_number"
            ? "Số CCCD/CMND"
            : "Số BHXH"
        } đã tồn tại`,
      });
    }
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

    // Kiểm tra person có tồn tại không
    const person = await prisma.person.findUnique({
      where: { id: parseInt(id) },
      include: {
        participations: {
          include: {
            trainingParticipations: true,
            competitionParticipations: true,
            absences: true,
          },
        },
      },
    });

    if (!person) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin cá nhân",
      });
    }

    // Xóa tất cả dữ liệu liên quan trong một transaction
    await prisma.$transaction(async (tx) => {
      // 1. Xóa tất cả absences
      for (const participation of person.participations) {
        if (participation.absences.length > 0) {
          await tx.absenceRecord.deleteMany({
            where: {
              participation_id: participation.id,
            },
          });
        }
      }

      // 2. Xóa tất cả training participations
      for (const participation of person.participations) {
        if (participation.trainingParticipations.length > 0) {
          await tx.trainingParticipant.deleteMany({
            where: {
              participation_id: participation.id,
            },
          });
        }
      }

      // 3. Xóa tất cả competition participations
      for (const participation of person.participations) {
        if (participation.competitionParticipations.length > 0) {
          await tx.competitionParticipant.deleteMany({
            where: {
              participation_id: participation.id,
            },
          });
        }
      }

      // 4. Xóa tất cả person participations
      await tx.personOnConcentration.deleteMany({
        where: {
          person_id: parseInt(id),
        },
      });

      // 5. Cuối cùng xóa person
      await tx.person.delete({
        where: { id: parseInt(id) },
      });
    });

    res.json({
      success: true,
      message: "Xóa thông tin cá nhân và dữ liệu liên quan thành công",
    });
  } catch (error) {
    console.error("Delete person error:", error);
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
        organization: true,
      },
      orderBy: {
        concentration: {
          startDate: "desc",
        },
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
    const { concentration_id, role_id, organization_id, note } = req.body;

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
        organization_id: parseInt(organization_id),
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
        organization: true,
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
    const { role_id, organization_id, note } = req.body;

    const participation = await prisma.personOnConcentration.update({
      where: {
        id: parseInt(participationId),
        person_id: parseInt(id),
      },
      data: {
        role_id: parseInt(role_id),
        organization_id: parseInt(organization_id),
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
        organization: true,
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

// Helper functions
const formatTeamType = (type) => {
  const types = {
    JUNIOR: "Trẻ",
    ADULT: "Tuyển",
    DISABILITY: "Người khuyết tật",
  };
  return types[type] || type;
};

const formatTeamGender = (gender) => {
  const genders = {
    MALE: "Nam",
    FEMALE: "Nữ",
    MIXED: "Hỗn hợp",
  };
  return genders[gender] || gender;
};
