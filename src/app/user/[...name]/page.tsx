"use client";
import { useParams } from "next/navigation";
import { getUser } from "./server/get-user";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Post from "@/app/post/[...id]/client/Post";
import Comment from "@/app/comment/[...id]/client/Comment";
import Layout from "@/components/layout";
import useSkeleton from "@/hooks/use-skeleton";
import { useSession } from "next-auth/react";
import { CompleteUser } from "../types/type";
import { Button } from "@/components/ui/button";
import useFollow from "./server/hooks/use-follow";

const User = () => {
  const { name } = useParams();
  const { data: session } = useSession();
  const [user, setUser] = useState<CompleteUser>();
  const userName = Array.isArray(name) ? name[0] : name;
  const skeleton = useSkeleton("user");
  const { isFollowing, handleFollow, handleUnFollow, checkUserFollowing } =
    useFollow({ user, onFollow: () => fetchUser() });

  if (!name || !userName) {
    return <Layout content={<p>Please provide a valid name</p>} />;
  }

  const fetchUser = async () => {
    try {
      const userData = await getUser({ name: userName });
      if (userData) {
        setUser(userData as CompleteUser);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchUser();
    };

    fetchData();
  }, [session]);

  useEffect(() => {
    if (user) {
      checkUserFollowing();
    }
  }, [user, session]);

  return (
    <Layout
      content={
        <>
          <div
            style={{
              backgroundImage: `url(${user?.background!})`,
            }}
            className="h-[180px] w-full bg-cover"
          />
          <div className="relative mx-4 mt-[-80px] flex items-center justify-between gap-2">
            <div className="flex items-center gap-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user?.image!} />
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <h1 className="text-4xl font-semibold text-white">
                  {user?.name}
                </h1>
                {user?.followers && (
                  <div className="flex gap-2">
                    <p>followers: {user?.followersCount}</p>
                    <p>following: {user?.followingCount}</p>
                  </div>
                )}
              </div>
            </div>
            {isFollowing !== undefined && user?.id !== session?.user?.id ? (
              isFollowing ? (
                <Button onClick={handleUnFollow}>Unfollow</Button>
              ) : (
                <Button onClick={handleFollow}>Follow</Button>
              )
            ) : null}
          </div>

          <Tabs defaultValue="posts" className="mx-4 mt-2">
            <TabsList className="w-[210px]">
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
              <TabsTrigger value="likes">Likes</TabsTrigger>
            </TabsList>
            <TabsContent value="posts">
              {user?.posts.map((post) => (
                <span key={post.id} className="flex flex-col">
                  <Post onCommentCreate={fetchUser} post={post} />
                </span>
              ))}
            </TabsContent>
            <TabsContent value="comments">
              {user?.comments.map((comment) => (
                <span key={comment.id} className="flex flex-col">
                  <Comment onCommentUpdate={fetchUser} comment={comment} />
                </span>
              ))}
            </TabsContent>
            <TabsContent value="likes">
              {user?.likedPosts?.map((like) => (
                <div key={like.id}>
                  {like && like.post && (
                    <Post onCommentCreate={fetchUser} post={like.post} />
                  )}
                </div>
              ))}
              {user?.likedComments?.map((like) => (
                <div key={like.id}>
                  {like.comment && (
                    <Comment
                      onCommentUpdate={fetchUser}
                      comment={like.comment}
                    />
                  )}
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </>
      }
      layoutNotFound={!name}
      layout={!name}
      skeleton={skeleton}
      error="User not found"
    />
  );
};

export default User;
