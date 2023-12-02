import { User, Comment as CommentType, Like } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CommentActions from "./CommentActions";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { checkLikeAction } from "../server/check-like-action";
import { likeAction } from "../server/like-action";
import useCommentLike from "../hooks/use-comment-like";
import Link from "next/link";

interface LikeWithUser extends Like {
  createdBy: User;
}

interface CommentWithUsers extends CommentType {
  commentLikes: LikeWithUser[];
  createdBy: User;
}

interface CommentProps {
  comment: CommentWithUsers;
  likes?: number;
  onCommentUpdate: () => void;
}

const Comment = ({ comment, onCommentUpdate, likes }: CommentProps) => {
  const { data: session } = useSession();
  const { isLiked, handleLike, handleUnlike, fetchLikeStatus } = useCommentLike(
    {
      comment,
      onCommentUpdate,
    },
  );

  useEffect(() => {
    fetchLikeStatus();
  }, [session, comment.id]);

  return (
    <Card key={comment.id} className="mb-2 p-0">
      <CardHeader className="flex flex-row items-center justify-between gap-2 p-4">
        <span className="flex gap-2 ">
          <Avatar>
            <AvatarImage src={comment.createdBy.image!} />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>

          <span className="flex flex-col">
            <CardTitle>
              <Link
                className="transition-colors hover:text-emerald-500"
                href={`/user/${comment.createdBy.name}`}
              >
                {comment.createdBy.name}
              </Link>
            </CardTitle>
            <span className="text-card-foreground/40">
              {comment.createdAt.toDateString()}
            </span>
          </span>
        </span>

        <CommentActions onCommentUpdate={onCommentUpdate} comment={comment} />
      </CardHeader>
      <CardContent className="p-0 pb-4 pl-4">{comment.content}</CardContent>
      <CardContent className="p-0 pb-4 pl-4">
        <span className="flex gap-1">
          {session && isLiked === true ? (
            <Heart
              className="cursor-pointer text-red-500 transition-colors hover:text-foreground/40"
              onClick={() => handleUnlike()}
            />
          ) : (
            <Heart
              className="cursor-pointer text-foreground/40 transition-colors hover:text-red-500"
              onClick={() => handleLike()}
            />
          )}
          {comment.commentLikes && (
            <p className="text-md font-sans font-medium">
              {comment.commentLikes.length}
            </p>
          )}
        </span>
      </CardContent>
    </Card>
  );
};

export default Comment;
