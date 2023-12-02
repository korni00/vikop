"use server";

import { db } from "@/server/db";
import { User as UserType } from "@prisma/client";
import { CommentWithUsers, CompleteUser, PostProps } from "../../types/type";

export const getUser = async ({ name }: { name: string }) => {
  if (!name) {
    return null;
  } else {
    try {
      const userWithPostsAndTags = await db.user.findFirst({
        where: {
          name: name,
        },
        include: {
          createdPosts: {
            include: {
              comments: {
                include: {
                  createdBy: true,
                  commentLikes: {
                    include: {
                      createdBy: true,
                    },
                  },
                },
              },
              postLikes: {
                include: {
                  post: {
                    include: {
                      createdBy: true,
                    },
                  },
                  comment: {
                    include: {
                      createdBy: true,
                    },
                  },
                  createdBy: true,
                },
              },
              createdBy: true,
            },
          },
          createdComments: {
            include: {
              createdBy: true,
              commentLikes: {
                include: {
                  createdBy: true,
                },
              },
            },
          },
          createdLikes: {
            include: {
              post: {
                include: {
                  createdBy: true,
                  postLikes: {
                    include: {
                      createdBy: true,
                    },
                  },
                },
              },
              comment: {
                include: {
                  createdBy: true,
                  commentLikes: {
                    include: {
                      createdBy: true,
                    },
                  },
                },
              },
            },
          },
          followers: {
            include: {
              follower: true,
              following: true,
            },
          },
          following: true,
        },
      });

      if (!userWithPostsAndTags) {
        return null;
      }

      const user: CompleteUser = {
        ...userWithPostsAndTags,
        posts: userWithPostsAndTags.createdPosts.map((post) => ({
          ...post,
          createdBy: post.createdBy,
          comments: post.comments,
          postLikes: post.postLikes,
        })),
        comments: userWithPostsAndTags.createdComments,
        likedComments: userWithPostsAndTags.createdLikes
          .filter((like) => like.comment !== null)
          .map((like) => ({
            ...like,
            comment: like.comment as CommentWithUsers,
          })),
        likedPosts: userWithPostsAndTags.createdLikes
          .filter((like) => like.post !== null)
          .map((like) => ({ ...like, post: like.post as PostProps })),
        followers: userWithPostsAndTags.followers.map((follow) => ({
          ...follow,
          follower: follow.follower as UserType,
          following: follow.following as UserType,
        })),
        followersCount: userWithPostsAndTags.following.length,
        followingCount: userWithPostsAndTags.followers.length,
      };

      return user;
    } catch (err) {
      console.log(err);
      return null;
    }
  }
};
