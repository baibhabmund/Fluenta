import { PrismaClient } from "@prisma/client";
import { services } from "../src/data/services";

const prisma = new PrismaClient();

async function main() {
  for (const service of services) {
    await prisma.course.upsert({
      where: { slug: service.slug },
      update: {
        title: service.name,
        description: service.short,
        price: service.price,
        published: true,
      },
      create: {
        slug: service.slug,
        title: service.name,
        description: service.short,
        price: service.price,
        published: true,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
