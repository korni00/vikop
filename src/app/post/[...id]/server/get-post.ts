"use server";

import { db } from "@/server/db";
import {
  Like,
  Post as PostType,
  User as UserType,
  Comment as CommentType,
} from "@prisma/client";

interface LikeWithUser extends Like {
  createdBy: UserType;
}

interface CommentWithUsers extends CommentType {
  createdBy: UserType;
  commentLikes: LikeWithUser[];
}

interface PostProps extends PostType {
  createdBy: UserType;
  comments: CommentWithUsers[];
  postLikes: LikeWithUser[];
}

export const getPost = async (postId: number): Promise<PostProps | null> => {
  if (postId) {
    try {
      const post = await db.post.findFirst({
        where: {
          id: postId,
        },
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
              commentLikes: true,
            },
          },
        },
      });
      return post as PostProps;
    } catch (err) {
      console.log(err);
      return null;
    }
  } else return null;
};
