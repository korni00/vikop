"use server";
import { db } from "@/server/db";
import { User } from "@prisma/client";
import { Session } from "next-auth";

export const checkAdminStatus = async (
  session: Session,
  tagName: string,
): Promise<boolean> => {
  try {
    const user: User | null = await db.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const tag = await db.tag.findFirst({
      where: {
        name: tagName,
        administrator: {
          id: user.id,
        },
      },
    });

    return !!tag;
  } catch (err) {
    console.error(err);
    throw new Error("Error checking admin status");
  }
};
