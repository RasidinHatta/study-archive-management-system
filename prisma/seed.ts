import { RoleName } from "@/lib/generated/prisma";
import db from "./prisma";
import bcrypt from "bcryptjs"; // Assuming bcryptjs is installed for password hashing

async function seedAdminUser() {
  const adminRole = await db.role.findUnique({
    where: {
      name: RoleName.ADMIN,
    },
  });

  if (!adminRole) {
    console.error("Admin role not found. Please seed roles first.");
    return;
  }

  const hashedPassword = await bcrypt.hash("@Dmin123", 10); // Hash the password

  await db.user.create({
    data: {
      email: "admin@sams.com",
      password: hashedPassword,
      role: {
        connect: {
          id: adminRole.id,
        },
      },
    },
  });
  console.log("Admin user seeded successfully.");
}

seedAdminUser().finally(() => db.$disconnect());