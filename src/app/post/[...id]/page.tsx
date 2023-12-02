"use client";
import { useState, useEffect } from "react";
import { getPost } from "./server/get-post";
import { useParams } from "next/navigation";
import {
  Like,
  Post as PostType,
  User as UserType,
  Comment as CommentType,
} from "@prisma/client";
import Header from "@/components/header";
import PostComponent from "./client/Post";
import Layout from "@/components/layout";
import useSkeleton from "@/hooks/use-skeleton";

interface LikeWithUser extends Like {
  createdBy: UserType;
}

interface CommentWithUsers extends CommentType {
  createdBy: UserType;
  commentLikes: LikeWithUser[];
}

interface ExtendedPostType extends PostType {
  createdBy: UserType;
  comments: CommentWithUsers[];
  postLikes: LikeWithUser[];
}

const PostPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState<ExtendedPostType | undefined>();
  const skeleton = useSkeleton("default");

  const fetchPost = async (postId: number) => {
    if (postId) {
      try {
        const fetchedPost = await getPost(postId);
        if (fetchedPost !== null) {
          setPost(fetchedPost);
        } else {
          setPost(undefined);
        }
      } catch (err) {
        console.log(err);
      }
    } else {
      setPost(undefined);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPost(Number(id));
    }
  }, [id]);

  return (
    <Layout
      content={
        <div className="px-4 py-2">
          {post ? <PostComponent post={post} /> : null}
        </div>
      }
      layoutNotFound={false}
      layout={false}
      skeleton={skeleton}
    />
  );
};

export default PostPage;
