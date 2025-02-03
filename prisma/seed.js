import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // Seed roles
  const roles = [
    { key: "R1", value: "Quản trị viên", type: "ROLE" },
    { key: "R2", value: "Quản lý", type: "ROLE" },
    { key: "R3", value: "Cán bộ phòng Quản lý huấn luyện", type: "ROLE" },
    { key: "R4", value: "Thành viên Tổ chuyên môn", type: "ROLE" },
    { key: "R5", value: "Người trả lời khảo sát", type: "ROLE" },
    { key: "R6", value: "Khách", type: "ROLE" },
  ];

  // Seed sports
  const sports = [
    { name: "Aerobic", description: "Môn thể thao Aerobic" },
    { name: "Bắn cung", description: "Môn thể thao Bắn cung" },
    { name: "Bắn súng", description: "Môn thể thao Bắn súng" },
    { name: "Billiard and Snooker", description: "Môn thể thao Billiard" },
    { name: "Bơi", description: "Môn thể thao Bơi lội" },
    { name: "Bóng đá", description: "Môn thể thao Bóng đá" },
    { name: "Bóng ném", description: "Môn thể thao Bóng ném" },
    {
      name: "Bóng ném bãi biển",
      description: "Môn thể thao Bóng ném bãi biển",
    },
    { name: "Boxing", description: "Môn thể thao Boxing" },
    { name: "Cầu lông", description: "Môn thể thao Cầu lông" },
    { name: "Cờ Tướng", description: "Môn thể thao Cờ Tướng" },
    { name: "Cờ Vua", description: "Môn thể thao Cờ Vua" },
    { name: "Cử tạ", description: "Môn thể thao Cử tạ" },
    {
      name: "Cử tạ Người khuyết tật",
      description: "Môn thể thao Cử tạ Người khuyết tật",
    },
    { name: "Đấu kiếm", description: "Môn thể thao Đấu kiếm" },
    { name: "Điền kinh", description: "Môn thể thao Điền kinh" },
    {
      name: "Điền kinh Người khuyết tật",
      description: "Môn thể thao Điền kinh Người khuyết tật",
    },
    { name: "Futsal", description: "Môn thể thao Futsal" },
    { name: "Judo Đối kháng", description: "Môn thể thao Judo Đối kháng" },
    { name: "Judo Quyền", description: "Môn thể thao Judo Quyền" },
    { name: "Karate", description: "Môn thể thao Karate" },
    { name: "Kickboxing", description: "Môn thể thao Kickboxing" },
    { name: "Kurash", description: "Môn thể thao Kurash" },
    { name: "Muay", description: "Môn thể thao Muay" },
    { name: "Pencak Silat", description: "Môn thể thao Pencak Silat" },
    { name: "Quần vợt", description: "Môn thể thao Quần vợt" },
    {
      name: "Taekwondo Đối kháng",
      description: "Môn thể thao Taekwondo Đối kháng",
    },
    { name: "Taekwondo Quyền", description: "Môn thể thao Taekwondo Quyền" },
    { name: "Thể dục dụng cụ", description: "Môn thể thao Thể dục dụng cụ" },
    { name: "Thể hình", description: "Môn thể thao Thể hình" },
    {
      name: "Xe đạp đường trường",
      description: "Môn thể thao Xe đạp đường trường",
    },
  ];

  // Seed tất cả dữ liệu với upsert
  for (const role of roles) {
    await prisma.allcode.upsert({
      where: { key: role.key },
      update: role,
      create: role,
    });
  }

  // Seed sports với upsert
  for (const sport of sports) {
    await prisma.sport.upsert({
      where: { name: sport.name },
      update: sport,
      create: sport,
    });
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
