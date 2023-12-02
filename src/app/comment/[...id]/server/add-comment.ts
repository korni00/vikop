"use server";
import { db } from "@/server/db";
import { Session } from "next-auth";
import { Comment } from "@prisma/client";

export const addComment = async ({
  content,
  session,
  postId,
}: {
  content: string;
  session: Session;
  postId: number;
}): Promise<Comment | null> => {
  if (!content || !session.user || !postId) {
    return null;
  }

  try {
    const newComment = await db.comment.create({
      data: {
        content: content,
        postId: postId,
        createdById: session.user.id,
      },
    });

    return newComment as Comment;
  } catch (err) {
    console.error("Error adding comment:", err);
    throw new Error("Failed to add comment");
  }
};
