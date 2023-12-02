import { useState } from "react";
import { useSession } from "next-auth/react";
import { deleteComment } from "../server/delete-comment";
import { Comment as CommentType, User } from "@prisma/client";
import { Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { MoreVertical } from "lucide-react";

interface CommentWithUsers extends CommentType {
  createdBy: User;
}

interface CommentProps {
  comment: CommentWithUsers;
  onCommentUpdate: () => void;
}

const CommentActions = ({ comment, onCommentUpdate }: CommentProps) => {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!session) {
    return null;
  }

  const handleRemoveComment = async () => {
    try {
      setIsSubmitting(true);
      await deleteComment({ session, commentId: comment.id });
    } catch (err) {
      console.error("Error removing comment:", err);
    } finally {
      setIsSubmitting(false);
      onCommentUpdate();
    }
  };

  return (
    <div className="flex flex-col">
      <DropdownMenu>
        <DropdownMenuTrigger className="transition-colors hover:text-foreground/40">
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {comment.createdBy.id === session.user.id && (
            <DropdownMenuItem onClick={handleRemoveComment}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Delete"}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default CommentActions;
