"use server";
import { db } from "@/server/db";
import { Session } from "next-auth";
import { Post } from "@prisma/client";

export const deletePost = async ({
  session,
  postId,
}: {
  session: Session;
  postId: number;
}): Promise<Post | null> => {
  if (!session.user || !postId) {
    return null;
  }

  try {
    const existingPost = await db.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        createdBy: true,
      },
    });

    if (!existingPost || existingPost.createdBy.id !== session.user.id) {
      return null;
    }

    const removedPost = await db.post.delete({
      where: {
        id: postId,
      },
    });

    return removedPost as Post;
  } catch (err) {
    console.error("Error deleting post:", err);
    throw new Error("Failed to delete post");
  }
};
