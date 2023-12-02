import { useState } from "react";
import { useSession } from "next-auth/react";
import { checkFollow } from "../check-follow";
import { addFollow } from "../add-follow";
import { removeFollow } from "../remove-follow";
import { User } from "@prisma/client";

interface UseFollowProps {
  user?: User | null;
  onFollow?: () => void;
}

const useFollow = ({ user: foundedUser, onFollow }: UseFollowProps) => {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState<boolean | undefined>(
    undefined,
  );

  const checkUserFollowing = async () => {
    if (foundedUser && session?.user) {
      try {
        const isFollowingUser = await checkFollow({
          follower: session.user,
          following: foundedUser,
        });
        setIsFollowing(isFollowingUser);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleFollow = async () => {
    if (foundedUser && session?.user && foundedUser.id !== session.user.id) {
      try {
        await addFollow({
          follower: session.user,
          following: foundedUser,
        });
        setIsFollowing(true);
        onFollow?.();
      } catch (err) {
        console.error(err);
      }
    } else return null;
  };

  const handleUnFollow = async () => {
    if (foundedUser && session?.user) {
      try {
        await removeFollow({
          follower: session.user,
          following: foundedUser,
        });
        setIsFollowing(false);
        onFollow?.();
      } catch (err) {
        console.error(err);
      }
    } else return null;
  };

  return {
    isFollowing,
    handleFollow,
    handleUnFollow,
    checkUserFollowing,
  };
};

export default useFollow;
