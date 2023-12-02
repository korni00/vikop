import { Search, Sidebar, User, ArrowBigLeftDash } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeSwitch } from "./theme";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const Navbar = () => {
  const router = useRouter();
  const { data: session } = useSession();
  return (
    <nav className="flex min-h-[calc(100vh-52px)] flex-col justify-between bg-card">
      <div className="flex flex-col">
        <Button
          variant="link"
          className="gap-2"
          onClick={() => router.push("/")}
        >
          <Sidebar />
          Home
        </Button>

        <Button
          onClick={() => router.push("/search")}
          variant="link"
          className="gap-2"
        >
          <Search />
          Search
        </Button>
        <Button
          disabled={!session?.user.name}
          onClick={() => router.push(`/user/${session?.user.name}`)}
          variant="link"
          className="gap-2"
        >
          <User />
          Profile
        </Button>
      </div>

      <div className="flex flex-col">
        <Button
          variant="link"
          className="flex gap-2 hover:text-red-500"
          onClick={() => router.back()}
        >
          <ArrowBigLeftDash />
          Back
        </Button>
        <ThemeSwitch />
      </div>
    </nav>
  );
};

export default Navbar;
