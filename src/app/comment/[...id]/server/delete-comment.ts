"use server";
import { db } from "@/server/db";
import { Session } from "next-auth";
import { Comment } from "@prisma/client";

export const deleteComment = async ({
  session,
  commentId,
}: {
  session: Session;
  commentId: number;
}): Promise<Comment | null> => {
  if (!session.user || !commentId) {
    return null;
  }

  try {
    const existingComment = await db.comment.findUnique({
      where: {
        id: commentId,
      },
      select: {
        createdBy: true,
      },
    });

    if (!existingComment || existingComment.createdBy.id !== session.user.id) {
      return null;
    }

    const removedComment = await db.comment.delete({
      where: {
        id: commentId,
      },
    });

    return removedComment as Comment;
  } catch (err) {
    console.error("Error deleting comment:", err);
    throw new Error("Failed to delete comment");
  }
};
