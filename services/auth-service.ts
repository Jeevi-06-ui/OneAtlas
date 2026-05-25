import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";

export async function registerUser(input: { name: string; email: string; password: string }) {
  const existing = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (existing) {
    throw new Error("EMAIL_IN_USE");
  }

  const passwordHash = await hashPassword(input.password);

  return prisma.user.create({
    data: {
      name: input.name,
      email: input.email.toLowerCase(),
      password: passwordHash,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}

export async function authenticateUser(input: { email: string; password: string }) {
  const user = await prisma.user.findUnique({
    where: { email: input.email.toLowerCase() },
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const valid = await verifyPassword(input.password, user.password);
  if (!valid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}
