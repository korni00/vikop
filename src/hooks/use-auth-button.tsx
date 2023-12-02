import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2 } from "lucide-react";
import Link from "next/link";

export const renderAuthButton = (status: string) => {
  const { data: session } = useSession();
  switch (status) {
    case "authenticated":
      return (
        <Link
          href={`/user/${session?.user.name}`}
          className="flex items-center gap-2"
        >
          <Avatar className=" h-8 w-8">
            <AvatarImage src={session?.user.image!} />
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
          {session?.user.name}
        </Link>
      );
    case "loading":
      return (
        <Button className="flex items-center gap-2" variant="outline">
          <Loader2 className=" animate-spin" /> Loading
        </Button>
      );
    case "unauthenticated":
      return (
        <Button variant="outline" onClick={() => signIn()}>
          Login
        </Button>
      );
    default:
      return null;
  }
};
