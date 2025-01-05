import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Seed bảng Allcode
  const roles = [
    { key: "R1", value: "Quản trị viên", type: "ROLE" },
    { key: "R2", value: "Quản lý", type: "ROLE" },
    { key: "R3", value: "Cán bộ phòng Quản lý huấn luyện", type: "ROLE" },
    { key: "R4", value: "Thành viên Tổ chuyên môn", type: "ROLE" },
    { key: "R5", value: "Người trả lời khảo sát", type: "ROLE" },
    { key: "R6", value: "Khách", type: "ROLE" },
  ];
  for (const role of roles) {
    await prisma.allcode.create({ data: role });
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
