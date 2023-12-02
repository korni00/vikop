"use client";

import { useEffect, useState } from "react";
import Header from "@/components/header";
import { getTopLikedTags } from "@/app/tag/[...name]/server/get-top-liked";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import CreatePost from "./post/[...id]/client/PostCreate";
import Layout from "@/components/layout";
import useSkeleton from "@/hooks/use-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function HomePage() {
  const [topLikedTags, setTopLikedTags] = useState<string[]>([]);
  const [isLoading, setLoading] = useState<boolean>(true);
  const skeleton = useSkeleton("default");

  const fetchTopLikedTags = async () => {
    try {
      const tags = await getTopLikedTags();
      setTopLikedTags(tags);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching top liked tags:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopLikedTags();
  }, []);

  return (
    <Layout
      content={
        <div className="flex flex-col gap-2 px-4 py-2">
          <div className="flex w-full gap-2">
            {isLoading
              ? Array.from(Array(10).keys()).map((index) => (
                  <Skeleton
                    key={index}
                    className="h-[22px] w-[80px] transition-colors hover:bg-emerald-400 hover:text-black"
                  />
                ))
              : topLikedTags.map((tagName, index) => (
                  <Link href={`tag/${tagName}`} key={index}>
                    <Badge className="transition-colors hover:bg-emerald-400 hover:text-black">
                      {tagName}
                    </Badge>
                  </Link>
                ))}
          </div>

          <CreatePost onPostCreate={fetchTopLikedTags} />
        </div>
      }
      layoutNotFound={false}
      layout={false}
      skeleton={skeleton}
    />
  );
}
