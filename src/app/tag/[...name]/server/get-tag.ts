"use server";
import { db } from "@/server/db";
import {
  Tag as TagType,
  Post as PostType,
  Comment as CommentType,
  User,
  Like,
} from "@prisma/client";

interface LikeWithUser extends Like {
  createdBy: User;
}

interface CommentWithUsers extends CommentType {
  createdBy: User;
  commentLikes: LikeWithUser[];
}

interface ExtendedPostType extends PostType {
  createdBy: User;
  comments: CommentWithUsers[];
  postLikes: LikeWithUser[];
}

interface TagWithPosts extends TagType {
  taggedPosts: ExtendedPostType[];
}

export const getTag = async (
  name: string | string[],
): Promise<TagWithPosts | null> => {
  const tagName = Array.isArray(name) ? name[0] : name;

  if (tagName) {
    try {
      const tag = await db.tag.findFirst({
        where: {
          name: tagName,
        },
        include: {
          taggedPosts: {
            include: {
              createdBy: true,
              postLikes: {
                include: {
                  createdBy: true,
                },
              },
              comments: {
                include: {
                  createdBy: true,
                  commentLikes: {
                    include: {
                      createdBy: true,
                    },
                  },
                },

                orderBy: {
                  createdAt: "desc",
                },
              },
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!tag) {
        return null;
      }

      return tag as TagWithPosts;
    } catch (err) {
      throw new Error("Error fetching tag");
    }
  } else {
    return null;
  }
};
