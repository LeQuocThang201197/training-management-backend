import { prisma } from "../config/prisma.js";

export const createUser = async (userData) => {
  return await prisma.user.create({
    data: userData,
    include: {
      Profile: true,
    },
  });
};

export const getUsers = async () => {
  return await prisma.user.findMany({
    include: {
      Profile: true,
      courses: true,
      teaching: true,
    },
  });
};
