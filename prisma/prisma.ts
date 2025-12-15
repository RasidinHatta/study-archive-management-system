import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/lib/generated/prisma';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });

const prismaClientSingleton = () => new PrismaClient({ adapter });

declare global {
  var prismaGlobal: PrismaClient | undefined;
}

const db = global.prismaGlobal ?? prismaClientSingleton();
export default db;

if (process.env.NODE_ENV !== 'production') global.prismaGlobal = db;