"use server";
import { db } from "@/server/db";
import { Session } from "next-auth";

interface LikeAction {
  session: Session;
  like: boolean;
  commentId?: number;
}

export const likeAction = async ({ session, like, commentId }: LikeAction) => {
  if (session) {
    try {
      const existingLike = await db.like.findFirst({
        where: {
          createdById: session.user.id,
          commentId: commentId ?? undefined,
        },
      });

      if (like === true) {
        if (!existingLike) {
          await db.like.create({
            data: {
              createdBy: {
                connect: {
                  id: session.user.id,
                },
              },
              comment: commentId
                ? {
                    connect: {
                      id: commentId,
                    },
                  }
                : undefined,
            },
          });
        } else {
          console.warn("Użytkownik już polubił ten post.");
        }
      } else if (like === false) {
        if (existingLike) {
          await db.like.deleteMany({
            where: {
              createdById: session.user.id,
              commentId: commentId ?? undefined,
            },
          });
        } else {
          console.warn("Użytkownik jeszcze nie polubił tego postu.");
        }
      } else {
        return null;
      }
    } catch (err) {
      console.error(err);
    }
  } else {
    return null;
  }
};
