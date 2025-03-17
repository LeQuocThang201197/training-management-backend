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
];

export const ALL_PERMISSIONS = permissions.map((p) => p.name);
