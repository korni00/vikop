"use server";
import { db } from "@/server/db";
import { Session } from "next-auth";

interface CheckLikeAction {
  session: Session;
  postId: number;
}

export const checkLikeAction = async ({ session, postId }: CheckLikeAction) => {
  try {
    if (!session) {
      return { liked: false };
    }

    const likes = await db.like.findMany({
      where: {
        createdById: session.user.id,
        postId: postId,
      },
    });

    const liked = likes.length > 0;

    return { liked };
  } catch (error) {
    console.error("Błąd podczas sprawdzania lajka:", error);
    return { liked: false, error: "Błąd podczas sprawdzania lajka" };
  }
};
