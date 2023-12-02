import { Textarea } from "@/components/ui/text-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { addComment } from "@/app/comment/[...id]/server/add-comment";
import { useSession } from "next-auth/react";
import React, { useState, useRef } from "react";

const CommentCreate = ({
  postId,
  onCommentCreate,
}: {
  postId: number;
  onCommentCreate: () => void;
}) => {
  const [newComment, setNewComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const { data: session } = useSession();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleCommentSubmit = async () => {
    try {
      if (
        postId &&
        session &&
        newComment.length >= 3 &&
        newComment.length <= 4000 &&
        !isSubmitting
      ) {
        setIsSubmitting(true);
        await addComment({ content: newComment, session, postId });
        setNewComment("");
        setIsSubmitting(false);
        if (onCommentCreate) {
          onCommentCreate();
        }
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      setIsSubmitting(false);
    }
  };

  const isContentValid = newComment.length >= 3 && newComment.length <= 3000;

  return (
    <div className="flex flex-col items-end gap-2 px-4">
      <Textarea
        name="content"
        placeholder="Type a comment."
        className="max-h-[120px] min-h-[100px] bg-card"
        value={newComment}
        disabled={!session?.user}
        onChange={(e) => setNewComment(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        ref={textareaRef}
      />
      <div className="flex w-full justify-between">
        <span className="flex gap-2">
          {isFocused && (newComment.length < 3 || newComment.length > 3000) ? (
            <p className="text-red-400">Comment chars length is invalid</p>
          ) : null}
        </span>
        <span className="flex gap-2">
          <Button
            variant="link"
            disabled={!isContentValid}
            onClick={() => setNewComment("")}
          >
            Clear
          </Button>
          <Button
            className="mb-2"
            type="button"
            onClick={handleCommentSubmit}
            disabled={
              !(newComment.length >= 3 && newComment.length <= 3000) ||
              isSubmitting ||
              !session?.user
            }
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </span>
      </div>
    </div>
  );
};

export default CommentCreate;
