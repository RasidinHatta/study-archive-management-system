import "dotenv/config";
import { PrismaClient } from '@/lib/generated/prisma';

const prismaClientSingleton = () =>
  new PrismaClient();

declare global {
  // Re-use the same global name so existing imports keep working
  var prismaGlobal: PrismaClient | undefined;
}

const db = global.prismaGlobal ?? prismaClientSingleton();

export default db;

if (process.env.NODE_ENV !== 'production') global.prismaGlobal = db;