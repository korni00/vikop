"use server";
import { db } from "@/server/db";

export const getTopLikedTags = async (): Promise<string[]> => {
  try {
    const allTags = await db.tag.findMany({
      select: {
        name: true,
        taggedLikes: {
          select: {
            id: true,
          },
        },
      },
    });

    const topTags = allTags
      .sort((a, b) => b.taggedLikes.length - a.taggedLikes.length)
      .slice(0, 10)
      .map((tag) => tag.name);

    return topTags;
  } catch (error) {
    console.error("Error getting top liked tags:", error);
    throw new Error("Failed to retrieve top liked tags");
  }
};
