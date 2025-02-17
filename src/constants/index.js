// Team constants
export const TEAM_LABELS = {
  // Team Type
  type: {
    JUNIOR: "Trẻ",
    ADULT: "Tuyển",
    DISABILITY: "Người khuyết tật",
  },

  // Management Room
  room: {
    ROOM_1: "Vụ 1",
    ROOM_2: "Vụ 2",
    ROOM_3: "Thể thao cho mọi người",
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
    room: TEAM_LABELS.room[team.room],
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
