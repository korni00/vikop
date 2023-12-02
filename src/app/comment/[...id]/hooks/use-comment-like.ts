import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { checkLikeAction } from "../server/check-like-action";
import { likeAction } from "../server/like-action";
import { Like, User, Comment as CommentType } from "@prisma/client";

interface LikeWithUser extends Like {
  createdBy: User;
}

interface CommentWithUsers extends CommentType {
  commentLikes: LikeWithUser[];
  createdBy: User;
}

interface UseCommentLikeProps {
  comment: CommentWithUsers;
  onCommentUpdate: () => void;
}

const useCommentLike = ({ comment, onCommentUpdate }: UseCommentLikeProps) => {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState<boolean | null>(null);

  const fetchLikeStatus = async () => {
    try {
      const { liked } = await checkLikeAction({
        session: session!,
        commentId: comment.id,
      });
      setIsLiked(liked);
    } catch (error) {
      console.error("Błąd podczas sprawdzania lajka:", error);
    }
  };

  const handleUnlike = async () => {
    await handleLikeAction(false);
  };

  const handleLike = async () => {
    await handleLikeAction(true);
  };

  const handleLikeAction = async (like: boolean) => {
    try {
      await likeAction({
        session: session!,
        like,
        commentId: comment.id,
      });
      onCommentUpdate();
      fetchLikeStatus();
    } catch (error) {
      console.error(
        `Błąd podczas przetwarzania akcji ${like ? "like" : "unlike"}:`,
        error,
      );
    }
  };

  return { isLiked, handleLike, handleUnlike, fetchLikeStatus };
};

export default useCommentLike;
