"use client";
import React from "react";
import { useEffect, useState } from "react";
import { getTag } from "./server/get-tag";
import { useParams } from "next/navigation";
import {
  Tag as TagType,
  User,
  Comment as CommentType,
  Post as PostType,
  Like,
} from "@prisma/client";
import Post from "@/app/post/[...id]/client/Post";
import CreatePost from "@/app/post/[...id]/client/PostCreate";
import Layout from "@/components/layout";
import useSkeleton from "@/hooks/use-skeleton";

interface LikeWithUser extends Like {
  createdBy: User;
}

interface CommentWithUsers extends CommentType {
  createdBy: User;
  commentLikes: LikeWithUser[];
}

interface ExtendedPostType extends PostType {
  createdBy: User;
  comments: CommentWithUsers[];
  postLikes: LikeWithUser[];
}

interface TagWithPosts extends TagType {
  taggedPosts: ExtendedPostType[];
}

const Tag = () => {
  const { name } = useParams();
  const [tag, setTag] = useState<TagWithPosts | null>(null);
  const [tagNotFound, setTagNotFound] = useState(false);
  const skeleton = useSkeleton("tag");

  if (!name) {
    return null;
  }

  const fetchData = async () => {
    try {
      const tagWithPosts = await getTag(name);

      if (tagWithPosts) {
        setTag(tagWithPosts);
        setTagNotFound(false);
      } else {
        setTag(null);
        setTagNotFound(true);
      }
    } catch (err) {
      console.error(err);
      setTag(null);
      setTagNotFound(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, [name]);

  return (
    <Layout
      content={
        tag && (
          <>
            <div
              style={{
                backgroundImage: `url(${tag.background})`,
              }}
              className="h-[180px] w-full bg-cover"
            />
            <div className="flex w-full  flex-col px-4">
              <div className="flex items-center justify-between py-2">
                <h1 className="text-4xl font-semibold ">#{tag.name}</h1>
                <p className="text-sm font-thin text-foreground/40">
                  Created at: {tag.createdAt.toDateString()}
                </p>
              </div>

              <CreatePost
                postPlaceholder={`#${tag.name}`}
                onPostCreate={() => fetchData()}
              />
              <span className="flex w-full flex-col">
                {tag.taggedPosts.map((post) => (
                  <Post
                    onCommentCreate={() => fetchData()}
                    key={post.id}
                    post={post}
                  />
                ))}
              </span>
            </div>
          </>
        )
      }
      layout={tag !== null}
      layoutNotFound={tagNotFound}
      skeleton={skeleton}
    />
  );
};

export default Tag;
