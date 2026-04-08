import { PrismaClient, AdminType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = "admin";
  const password = "admin123";
  const mobile = "1234567890";
  const email = "admin@admin.com";

  console.log(`Creating admin: ${username}...`);

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const admin = await prisma.admin.upsert({
      where: { username: username },
      update: {
        password: hashedPassword,
        username: username,
        email: email,
      },
      create: {
        firstName: "Super",
        lastName: "Admin",
        mobile: mobile,
        email: email,
        username: username,
        password: hashedPassword,
        adminType: AdminType.SUPERADMIN,
      },
    });

    console.log("✅ Admin created/updated successfully!");
    console.log("Credentials:");
    console.log(`- Username: ${admin.username}`);
    console.log(`- Password: ${password}`);
    console.log(`- Mobile: ${admin.mobile}`);
  } catch (error) {
    console.error("❌ Error creating admin:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
