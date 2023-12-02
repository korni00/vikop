"use server";
import { db } from "@/server/db";
import { User } from "next-auth";

interface FollowAction {
  follower: User;
  following: User;
}

export const checkFollow = async ({ follower, following }: FollowAction) => {
  try {
    const existingFollow = await db.follow.findFirst({
      where: {
        followerId: follower.id,
        followingId: following.id,
      },
    });

    console.log("Existing Follow:", existingFollow);

    return !!existingFollow;
  } catch (err) {
    console.error(err);
    return false;
  }
};
