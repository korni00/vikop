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
import { useSession } from "next-auth/react";
import { checkAdminStatus } from "./server/is-user-admin";
import EditBackground from "./client/EditBackground";
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
  const { data: session } = useSession();
  const [tag, setTag] = useState<TagWithPosts | null>(null);
  const [tagNotFound, setTagNotFound] = useState(false);
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const skeleton = useSkeleton("tag");

  const fetchDataAndCheckAdmin = async () => {
    if (!name) return;

    try {
      const tagWithPosts = await getTag(name);

      if (tagWithPosts) {
        setTag(tagWithPosts);
        setTagNotFound(false);

        if (session && tagWithPosts.name) {
          const isAdmin = await checkAdminStatus(session, tagWithPosts.name);
          setIsUserAdmin(isAdmin);
        }
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
    fetchDataAndCheckAdmin();
  }, [name, session]);

  return (
    <Layout
      content={
        tag && (
          <>
            <div
              style={{
                backgroundImage: `url(${tag.background})`,
              }}
              className="flex h-[180px] w-full items-end justify-end gap-2 bg-cover pb-2 pr-2"
            >
              {isUserAdmin ? (
                <div className="flex rounded-sm bg-card/50 px-2 py-1 text-foreground">
                  <EditBackground tag={tag.name as string} />
                </div>
              ) : null}
            </div>
            <div className="flex w-full  flex-col px-4">
              <div className="flex items-center justify-between py-2">
                <h1 className="text-4xl font-semibold ">#{tag.name}</h1>
                <p className="text-sm font-thin text-foreground/40">
                  Created at: {tag.createdAt.toDateString()}
                </p>
              </div>

              <CreatePost
                postPlaceholder={`#${tag.name}`}
                onPostCreate={() => fetchDataAndCheckAdmin()}
              />
              <span className="flex w-full flex-col">
                {tag.taggedPosts.map((post) => (
                  <Post
                    onCommentCreate={() => fetchDataAndCheckAdmin()}
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
