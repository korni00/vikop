import { useState } from "react";
import { useSession } from "next-auth/react";
import { Comment as CommentType, User, Post as PostType } from "@prisma/client";
import { Loader2, MoreVertical } from "lucide-react";
import { deletePost } from "../server/delete-post";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

interface CommentWithUsers extends CommentType {
  createdBy: User;
}

interface ExtendedPostType extends PostType {
  createdBy: User;
  comments: CommentWithUsers[];
}

interface PostProps {
  post: ExtendedPostType;
  onPostUpdate?: () => void;
}

const PostActions = ({ post, onPostUpdate }: PostProps) => {
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  if (!session) {
    return null;
  }

  const handleRemoveComment = async () => {
    try {
      setIsSubmitting(true);
      await deletePost({ session, postId: post.id });
    } catch (err) {
      console.error("Error removing comment:", err);
    } finally {
      setIsSubmitting(false);
      if (onPostUpdate) {
        onPostUpdate();
      }
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="transition-colors hover:text-foreground/40">
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {post.createdBy.id === session.user.id && (
            <DropdownMenuItem onClick={handleRemoveComment}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Delete"}
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => router.push(`/post/${post.id}`)}>
            Go to post
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default PostActions;
