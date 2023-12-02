"use server";
import { db } from "@/server/db";
import { User, Follow } from "@prisma/client";

type UserPreview = Omit<User, "password"> & {
  followers: FollowerWithUsers[];
  followersCount: number;
  followingCount: number;
};

type FollowerWithUsers = Follow & {
  follower: UserType;
  following: UserType;
};

type UserType = Omit<User, "password">;

export const getUserPreview = async (
  name: string,
): Promise<UserPreview | null> => {
  if (name) {
    try {
      const userPrev = await db.user.findFirst({
        where: {
          name: {
            contains: name,
          },
        },
        include: {
          followers: {
            include: {
              follower: true,
              following: true,
            },
          },
          following: true,
        },
      });

      if (userPrev) {
        const followers: FollowerWithUsers[] = userPrev.followers.map(
          (follow: Follow) => ({
            ...follow,
            follower: follow.followerId as unknown as UserType,
            following: follow.followingId as unknown as UserType,
          }),
        );

        return {
          ...userPrev,
          followers,
          followersCount: userPrev.following.length,
          followingCount: followers.length,
        };
      }

      return null;
    } catch (err) {
      console.error(err);
      return null;
    }
  } else {
    return null;
  }
};
