"use server";
import { db } from "@/server/db";
import { Tag } from "@prisma/client";
import { Session } from "next-auth";

export const createPost = async ({
  session,
  content,
  tags,
}: {
  session: Session | null;
  content: string;
  tags: string[];
}) => {
  try {
    if (!session || !content || !tags) {
      return null;
    }

    const tagCreationLock: Record<string, boolean> = {};

    const createTagIfNotExists = async (
      tagName: string,
      lock: Record<string, boolean>,
    ): Promise<Tag> => {
      if (lock[tagName]) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return createTagIfNotExists(tagName, lock);
      }

      lock[tagName] = true;

      try {
        const existingTag = await db.tag.findFirst({
          where: {
            name: tagName,
          },
        });

        if (existingTag) {
          return existingTag;
        }

        const newTag = await db.tag.create({
          data: {
            name: tagName,
            createdBy: { connect: { id: session.user.id } },
            administrator: { connect: { id: session.user.id } },
          },
        });

        return newTag;
      } catch (error) {
        throw new Error(`Failed to create tag "${tagName}": ${error}`);
      } finally {
        lock[tagName] = false;
      }
    };
    const tagsData = await Promise.all(
      tags.map((tag) => createTagIfNotExists(tag, tagCreationLock)),
    );

    const newPost = await db.post.create({
      data: {
        name: content,
        tags: {
          connectOrCreate: tagsData.map((tag) => ({
            where: { id: tag.id },
            create: {
              name: tag.name,
              createdBy: { connect: { id: session.user.id } },
              administrator: { connect: { id: session.user.id } },
            },
          })),
        },
        createdBy: {
          connect: { id: session.user.id },
        },
      },
    });

    return newPost;
  } catch (err) {
    throw new Error(`Failed to create post: ${err}`);
  }
};
