import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Admin user
  const adminId = "admin-seed-001";
  const hashedPassword = await hashPassword("admin123");
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      id: adminId,
      name: "Admin",
      email: "admin@example.com",
      emailVerified: true,
      role: "admin",
    },
  });
  await prisma.account.upsert({
    where: { id: "account-seed-001" },
    update: {},
    create: {
      id: "account-seed-001",
      accountId: adminId,
      providerId: "credential",
      userId: adminId,
      password: hashedPassword,
    },
  });

  // Sample videos
  await prisma.video.upsert({
    where: { slug: "nextjs-app-router-intro" },
    update: {},
    create: {
      title: "Next.js App Router 完整教學",
      slug: "nextjs-app-router-intro",
      description: "從零開始學習 Next.js App Router 的完整教學影片。",
      muxUploadId: "seed-placeholder-1",
      uploadStatus: "ready",
      duration: 1820,
      status: "published",
    },
  });

  await prisma.video.upsert({
    where: { slug: "figma-design-system" },
    update: {},
    create: {
      title: "Figma Design System 建立指南",
      slug: "figma-design-system",
      description: "學習如何在 Figma 中建立可擴展的 Design System。",
      muxUploadId: "seed-placeholder-2",
      uploadStatus: "ready",
      duration: 2400,
      status: "published",
    },
  });

  await prisma.video.upsert({
    where: { slug: "startup-funding-101" },
    update: {},
    create: {
      title: "新創募資入門",
      slug: "startup-funding-101",
      description: "了解新創公司募資的基本流程與注意事項。",
      muxUploadId: "seed-placeholder-3",
      uploadStatus: "waiting",
      duration: 960,
      status: "draft",
    },
  });

  console.log("Seed completed: 1 admin user, 3 videos");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
