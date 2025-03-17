import { ALL_PERMISSIONS } from "./permissions.js";

export const roles = [
  {
    name: "Quản trị viên",
    description: "Quản trị hệ thống và phân quyền người dùng",
    permissions: ["ADMIN"],
  },
  {
    name: "Chuyên viên",
    description: "Thực hiện các nhiệm vụ chuyên môn được giao",
    permissions: [
      "CREATE_PERSON",
      "READ_PERSON",
      "UPDATE_PERSON",
      "CREATE_CONCENTRATION",
      "READ_CONCENTRATION",
      "UPDATE_CONCENTRATION",
      "CREATE_TRAINING",
      "READ_TRAINING",
      "UPDATE_TRAINING",
      "CREATE_COMPETITION",
      "READ_COMPETITION",
      "UPDATE_COMPETITION",
      "CREATE_PAPER",
      "READ_PAPER",
      "UPDATE_PAPER",
    ],
  },
];
