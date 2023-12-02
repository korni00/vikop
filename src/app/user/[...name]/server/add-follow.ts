"use server";
import { db } from "@/server/db";
import { User } from "next-auth";

interface FollowAction {
  follower: User;
  following: User;
}

export const addFollow = async ({ follower, following }: FollowAction) => {
  try {
    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: follower.id,
        followingId: following.id,
      },
    });

    if (existingFollow) {
      return false;
    }

    await db.follow.create({
      data: {
        follower: {
          connect: { id: follower.id },
        },
        following: {
          connect: { id: following.id },
        },
      },
    });

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};
