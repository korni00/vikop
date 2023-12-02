"use server";
import { db } from "@/server/db";
import { User } from "next-auth";

interface FollowAction {
  follower: User;
  following: User;
}

export const removeFollow = async ({ follower, following }: FollowAction) => {
  try {
    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: follower.id,
        followingId: following.id,
      },
    });

    if (existingFollow) {
      await db.follow.delete({
        where: {
          id: existingFollow.id,
        },
      });
      return true;
    } else {
      return true;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
};
