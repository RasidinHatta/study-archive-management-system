declare module '@prisma/nextjs-monorepo-workaround-plugin' {
    interface Plugin {
      apply?: (...args: any[]) => void;
      // You can add more fields if needed
    }
  
    export function PrismaPlugin(): Plugin;
  }
  