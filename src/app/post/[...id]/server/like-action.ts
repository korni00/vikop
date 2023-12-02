"use server";
import { db } from "@/server/db";
import { Session } from "next-auth";

interface LikeAction {
  session: Session;
  like: boolean;
  postId?: number;
}

export const likeAction = async ({ session, like, postId }: LikeAction) => {
  if (session) {
    try {
      const existingLike = await db.like.findFirst({
        where: {
          createdById: session.user.id,
          postId: postId ?? undefined,
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
              post: postId
                ? {
                    connect: {
                      id: postId,
                    },
                  }
                : undefined,
            },
          });
        } else {
          console.warn("Użytkownik już polubił ten post.");
          // Obsługa przypadku, gdy użytkownik już polubił ten post
        }
      } else if (like === false) {
        if (existingLike) {
          await db.like.deleteMany({
            where: {
              createdById: session.user.id,
              postId: postId ?? undefined,
            },
          });
        } else {
          console.warn("Użytkownik jeszcze nie polubił tego postu.");
          // Obsługa przypadku, gdy użytkownik jeszcze nie polubił tego postu
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
