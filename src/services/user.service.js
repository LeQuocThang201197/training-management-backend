import { prisma } from "../config/prisma.js";

export const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
    include: {
      profile: true,
    },
  });
};

export const getUsers = async () => {
  return await prisma.user.findMany({
    include: {
      profile: true,
      courses: true,
      teaching: true,
    },
  });
};
