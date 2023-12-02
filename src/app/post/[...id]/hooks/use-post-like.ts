import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { checkLikeAction } from "../server/check-like-action";
import { likeAction } from "../server/like-action";

interface UsePostLikeProps {
  postId: number;
  onCommentCreate?: () => void;
}

const usePostLike = ({ postId, onCommentCreate }: UsePostLikeProps) => {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState<boolean | null>(null);

  const fetchLikeStatus = async () => {
    try {
      const { liked } = await checkLikeAction({
        session: session!,
        postId: postId,
      });
      setIsLiked(liked);
    } catch (error) {
      console.error("Błąd podczas sprawdzania lajka:", error);
    }
  };

  const handleLikeAction = async (like: boolean) => {
    try {
      await likeAction({
        session: session!,
        like,
        postId,
      });
      onCommentCreate?.();
      fetchLikeStatus();
    } catch (error) {
      console.error(
        `Błąd podczas przetwarzania akcji ${like ? "like" : "unlike"}:`,
        error,
      );
    }
  };

  const handleUnlike = async () => {
    await handleLikeAction(false);
  };

  const handleLike = async () => {
    await handleLikeAction(true);
  };

  return { isLiked, handleLike, handleUnlike, fetchLikeStatus, setIsLiked };
};

export default usePostLike;
