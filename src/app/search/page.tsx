"use client";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useSkeleton from "@/hooks/use-skeleton";
import { useEffect, useState } from "react";
import { getUserPreview } from "../user/[...name]/server/get-preview";
import { User } from "@prisma/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import useFollow from "../user/[...name]/server/hooks/use-follow";
import { useSession } from "next-auth/react";

type ExtendedUser = User & {
  followersCount?: number;
  followingCount?: number;
};

const Search = () => {
  const skeleton = useSkeleton("default");
  const { data: session } = useSession();
  const [foundedUser, setFoundedUser] = useState<ExtendedUser | null>(null);
  const { isFollowing, handleFollow, handleUnFollow, checkUserFollowing } =
    useFollow({
      user: foundedUser,
      onFollow: () => fetchUserPreview("default"),
    });

  const fetchUserPreview = async (value: string) => {
    if (value) {
      try {
        const data = await getUserPreview(value);
        setFoundedUser(data);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const fetchPreview = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const value = formData.get("value") as string;
    fetchUserPreview(value);
  };

  useEffect(() => {
    fetchUserPreview("default");
  }, []);

  useEffect(() => {
    if (foundedUser) {
      checkUserFollowing();
    }
  }, [foundedUser]);

  return (
    <>
      <Layout
        content={
          <div className="flex flex-col gap-2 bg-card px-4 py-2">
            <form
              onSubmit={(event) => fetchPreview(event)}
              className="flex gap-2"
            >
              <Input name="value" />
              <Button type="submit" variant="default">
                Submit
              </Button>
            </form>
            {foundedUser && (
              <Card className="z-0 flex items-center justify-between">
                <Link
                  className="z-0 transition-colors hover:text-emerald-500"
                  href={`/user/${foundedUser.name}`}
                >
                  <CardHeader className="flex flex-row items-center p-4">
                    <span className="flex gap-2">
                      <Avatar>
                        <AvatarImage src={foundedUser.image!} />
                        <AvatarFallback>?</AvatarFallback>
                      </Avatar>

                      <span className="flex flex-col">
                        <CardTitle>{foundedUser.name}</CardTitle>
                        <div className="flex gap-2 text-sm text-foreground/40">
                          <p>Followers: {foundedUser.followersCount}</p>
                          <p>Following: {foundedUser.followingCount}</p>
                        </div>
                      </span>
                    </span>
                  </CardHeader>
                </Link>

                <CardContent className="p-0 pr-4">
                  {isFollowing !== undefined &&
                  foundedUser?.id !== session?.user?.id ? (
                    isFollowing ? (
                      <Button className="z-10" onClick={handleUnFollow}>
                        Unfollow
                      </Button>
                    ) : (
                      <Button className="z-10" onClick={handleFollow}>
                        Follow
                      </Button>
                    )
                  ) : null}
                </CardContent>
              </Card>
            )}
          </div>
        }
        layoutNotFound={false}
        layout={false}
        skeleton={skeleton}
      />
    </>
  );
};

export default Search;
