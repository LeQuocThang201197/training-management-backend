// Team constants
export const TEAM_LABELS = {
  // Team Type
  type: {
    JUNIOR: "Trẻ",
    ADULT: "Tuyển",
    DISABILITY: "Người khuyết tật",
  },

  // Team Gender
  gender: {
    MALE: "Nam",
    FEMALE: "Nữ",
    MIXED: "Cả nam và nữ",
  },
};

// Helper function để format team info
export const formatTeamInfo = (team) => {
  return {
    id: team.id,
    sport: team.sport.name,
    type: TEAM_LABELS.type[team.type],
    gender: TEAM_LABELS.gender[team.gender],
    createdAt: team.createdAt,
    updatedAt: team.updatedAt,
    rawData: {
      sportId: team.sportId,
      type: team.type,
      room: team.room,
      gender: team.gender,
    },
  };
};

export const MANAGEMENT_ROOMS = {
  ROOM: "Phòng Thể thao thành tích cao",
  ROOM_1: "Phòng Thể thao thành tích cao 1",
  ROOM_2: "Phòng Thể thao thành tích cao 2",
  ROOM_3: "Phòng Thể thao cho mọi người",
};
