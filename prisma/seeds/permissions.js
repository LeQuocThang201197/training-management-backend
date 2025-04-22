export const permissions = [
  // Special permission for admin
  {
    name: "ADMIN",
    description: "Full system access with all permissions",
  },
  // Regular permissions
  {
    name: "CREATE_PERSON",
    description: "Create new person",
  },
  {
    name: "READ_PERSON",
    description: "Xem thông tin vận động viên, HLV, chuyên gia",
  },
  {
    name: "UPDATE_PERSON",
    description: "Cập nhật thông tin vận động viên, HLV, chuyên gia",
  },
  { name: "DELETE_PERSON", description: "Xóa vận động viên, HLV, chuyên gia" },

  // Quản lý đợt tập trung
  { name: "CREATE_CONCENTRATION", description: "Tạo đợt tập trung mới" },
  { name: "READ_CONCENTRATION", description: "Xem thông tin đợt tập trung" },
  {
    name: "UPDATE_CONCENTRATION",
    description: "Cập nhật thông tin đợt tập trung",
  },
  { name: "DELETE_CONCENTRATION", description: "Xóa đợt tập trung" },

  // Quản lý tập huấn
  { name: "CREATE_TRAINING", description: "Tạo đợt tập huấn mới" },
  { name: "READ_TRAINING", description: "Xem thông tin đợt tập huấn" },
  { name: "UPDATE_TRAINING", description: "Cập nhật thông tin đợt tập huấn" },
  { name: "DELETE_TRAINING", description: "Xóa đợt tập huấn" },

  // Quản lý thi đấu
  { name: "CREATE_COMPETITION", description: "Tạo giải đấu mới" },
  { name: "READ_COMPETITION", description: "Xem thông tin giải đấu" },
  { name: "UPDATE_COMPETITION", description: "Cập nhật thông tin giải đấu" },
  { name: "DELETE_COMPETITION", description: "Xóa giải đấu" },

  // Quản lý văn bản
  { name: "CREATE_PAPER", description: "Tạo văn bản mới" },
  { name: "READ_PAPER", description: "Xem thông tin văn bản" },
  { name: "UPDATE_PAPER", description: "Cập nhật thông tin văn bản" },
  { name: "DELETE_PAPER", description: "Xóa văn bản" },

  // New permissions for Team
  { name: "CREATE_TEAM", description: "Create new team" },
  { name: "READ_TEAM", description: "View team information" },
  { name: "UPDATE_TEAM", description: "Update team information" },
  { name: "DELETE_TEAM", description: "Delete team" },

  // Sport permissions
  { name: "CREATE_SPORT", description: "Create new sport" },
  { name: "READ_SPORT", description: "View sport information" },
  { name: "UPDATE_SPORT", description: "Update sport information" },
  { name: "DELETE_SPORT", description: "Delete sport" },

  // Organization permissions
  { name: "CREATE_ORGANIZATION", description: "Create new organization" },
  { name: "READ_ORGANIZATION", description: "View organization information" },
  {
    name: "UPDATE_ORGANIZATION",
    description: "Update organization information",
  },
  { name: "DELETE_ORGANIZATION", description: "Delete organization" },

  // Person Role permissions
  { name: "CREATE_PERSON_ROLE", description: "Create new person role" },
  { name: "READ_PERSON_ROLE", description: "View person role information" },
  { name: "UPDATE_PERSON_ROLE", description: "Update person role information" },
  { name: "DELETE_PERSON_ROLE", description: "Delete person role" },

  // Absence permissions
  { name: "CREATE_ABSENCE", description: "Create new absence record" },
  { name: "READ_ABSENCE", description: "View absence information" },
  { name: "UPDATE_ABSENCE", description: "Update absence information" },
  { name: "DELETE_ABSENCE", description: "Delete absence record" },

  // New permission for overview
  {
    name: "READ_OVERVIEW",
    description: "View overview statistics and dashboard",
  },
];

export const ALL_PERMISSIONS = permissions.map((p) => p.name);
