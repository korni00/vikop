"use server";

import { db } from "@/server/db";
import { Session } from "next-auth";

interface EditBackground {
  session: Session;
  tag: string;
  newBackground: string;
}

export const editBackground = async ({
  session,
  tag,
  newBackground,
}: EditBackground) => {
  try {
    const tagToUpdate = await db.tag.findUnique({
      where: {
        name: tag,
      },
    });

    if (tagToUpdate && tagToUpdate.createdById === session.user.id) {
      if (newBackground !== null && newBackground !== undefined) {
        const updatedTag = await db.tag.update({
          where: {
            name: tag,
          },
          data: {
            background: newBackground,
          },
        });

        console.log("Updated tag:", updatedTag);
      } else {
        console.error("Invalid background value");
      }
    } else {
      console.error(
        "Tag not found or user does not have permission to update.",
      );
    }
  } catch (err) {
    console.error(err);
  }
};
