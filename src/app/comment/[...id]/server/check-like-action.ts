"use server";
import { db } from "@/server/db";
import { Session } from "next-auth";

interface CheckLikeAction {
  session: Session;
  commentId: number;
}

export const checkLikeAction = async ({
  session,
  commentId,
}: CheckLikeAction) => {
  try {
    if (!session) {
      return { liked: false };
    }

    const likes = await db.like.findMany({
      where: {
        createdById: session.user.id,
        commentId: commentId,
      },
    });

    const liked = likes.length > 0;

    return { liked };
  } catch (error) {
    console.error("Błąd podczas sprawdzania lajka:", error);
    return { liked: false, error: "Błąd podczas sprawdzania lajka" };
  }
};
