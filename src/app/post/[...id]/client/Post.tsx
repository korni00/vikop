"use client";
import React, { useEffect, useState } from "react";
import {
  User,
  Comment as CommentType,
  Post as PostType,
  Like,
} from "@prisma/client";
import Comment from "@/app/comment/[...id]/client/Comment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CommentCreate from "../../../comment/[...id]/client/CommentCreate";
import PostActions from "./PostActions";
import { Heart, MessageCircle, Reply } from "lucide-react";
import useDateFormat from "@/hooks/use-date-format";
import { useSession } from "next-auth/react";
import usePostLike from "../hooks/use-post-like";
import useHighlightTags from "../hooks/use-highlight-tags";
import Link from "next/link";

interface LikeWithUser extends Like {
  createdBy: User;
}

interface CommentWithUsers extends CommentType {
  commentLikes: LikeWithUser[];
  createdBy: User;
}

interface ExtendedPostType extends PostType {
  createdBy: User;
  comments: CommentWithUsers[];
  postLikes: LikeWithUser[];
}

interface PostProps {
  post: ExtendedPostType;
  onCommentCreate?: () => void;
}

const Post = ({ post, onCommentCreate }: PostProps) => {
  const [isCommenting, setIsCommenting] = useState<boolean>(false);
  const formattedDate = useDateFormat(post.createdAt, { hour12: true });
  const { data: session } = useSession();
  const { highlightTags } = useHighlightTags(post.name);
  const { isLiked, handleLike, handleUnlike, fetchLikeStatus, setIsLiked } =
    usePostLike({
      postId: post.id,
      onCommentCreate,
    });

  useEffect(() => {
    fetchLikeStatus();
  }, [session, post.id]);

  const handleClick = () => {
    if (session) {
      isLiked ? handleUnlike() : handleLike();
      setIsLiked(!isLiked);
    }
  };

  return (
    <Card key={post.id} className="mb-2 bg-default">
      <CardHeader className="flex flex-row items-center justify-between gap-2 p-4">
        <span className="flex gap-2">
          <Avatar>
            <AvatarImage src={post.createdBy.image!} />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>

          <span className="flex flex-col">
            <CardTitle>
              <Link
                className="transition-colors hover:text-emerald-500"
                href={`/user/${post.createdBy.name}`}
              >
                {post.createdBy.name}
              </Link>
            </CardTitle>
            <span className="text-card-foreground/40">{formattedDate}</span>
          </span>
        </span>

        <PostActions post={post} onPostUpdate={onCommentCreate} />
      </CardHeader>

      <CardContent className="p-0 pb-4 pl-6">{highlightTags()}</CardContent>

      <CardContent className="flex flex-col p-0 pb-2">
        <>
          <div className="mx-4 flex border-b-[1px] border-t-[1px] border-background/40 py-1">
            <span className="flex gap-1">
              {post.comments ? (
                <>
                  <p className="text-md mr-4 flex gap-1 font-sans font-medium text-foreground/40">
                    <MessageCircle />
                    {post.comments.length}
                  </p>
                </>
              ) : null}
            </span>
            <span
              onClick={handleClick}
              className={`flex cursor-pointer gap-1 transition-colors ${
                session && isLiked === true
                  ? " text-red-500 hover:text-foreground/40"
                  : " text-foreground/40  hover:text-red-500"
              }`}
            >
              <Heart />
              <p className="text-md font-sans font-medium">
                {post.postLikes && post.postLikes.length}
              </p>
            </span>
            <p
              onClick={() => setIsCommenting((prev) => !prev)}
              className={`ml-4 flex cursor-pointer gap-1 transition-colors  ${
                isCommenting
                  ? "text-foreground hover:text-foreground/40"
                  : "text-foreground/40 hover:text-foreground"
              }`}
            >
              <Reply />
              Reply
            </p>
          </div>
        </>

        <span className="mt-2 px-4">
          {post.comments?.map((comment) => (
            <Comment
              onCommentUpdate={() => onCommentCreate?.()}
              key={comment.id}
              comment={comment}
            />
          ))}
        </span>
      </CardContent>
      {isCommenting ? (
        <CommentCreate
          postId={post.id}
          onCommentCreate={() => onCommentCreate?.()}
        />
      ) : null}
    </Card>
  );
};

export default Post;
