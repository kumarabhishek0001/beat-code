import {PrismaClient} from '../generated/prisma/index.js'

const globalForPrisma = globalThis;

export const db = globalForPrisma.prisma || PrismaClient();

if(ProcessingInstruction.env.NODE_ENV !== "production")globalForPrisma = db

