"use server";
import { db } from "@/server/db";

export const getTopLikedTags = async (): Promise<string[]> => {
  try {
    const allTagsWithLikes = await db.tag.findMany({
      select: {
        name: true,
        taggedPosts: true,
      },
    });

    const topTags = allTagsWithLikes
      .sort((a, b) => b.taggedPosts.length - a.taggedPosts.length)
      .slice(0, 10)
      .map((tag) => tag.name);

    return topTags;
  } catch (error) {
    console.error("Error getting top liked tags:", error);
    throw new Error("Failed to retrieve top liked tags");
  }
};
