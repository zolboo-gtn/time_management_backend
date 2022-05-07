import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  // await prisma.user.deleteMany();
  // await prisma.question.deleteMany();
  // await prisma.comment.deleteMany();
  // await prisma.tag.deleteMany();
};

main()
  .catch((error) => console.error(error))
  .finally(async () => await prisma.$disconnect());
