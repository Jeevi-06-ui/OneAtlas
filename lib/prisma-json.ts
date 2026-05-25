import type { Prisma } from "@prisma/client";

export function toPrismaJson<T>(value: T): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export function fromPrismaJson<T>(value: Prisma.JsonValue): T {
  return value as T;
}
