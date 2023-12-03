import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Image, Loader2 } from "lucide-react";
import { editBackground } from "../server/edit-background";
import { useSession } from "next-auth/react";
import { useState } from "react";

const EditBackground = ({ tag }: { tag: string }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [inputError, setInputError] = useState<string | null>(null);

  if (!session || !tag) {
    return null;
  }

  const handleChangeBg = async () => {
    const formData = new FormData();
    const inputElement = document.querySelector(
      'input[name="bg"]',
    ) as HTMLInputElement;

    const discordRegex =
      /^(https:\/\/cdn\.discordapp\.com\/attachments\/\d+\/\d+\/\w+\.\w{3,4}\?(?:[^&=\n]*=[^&=\n]*&)*(?:[^&=\n]*=[^&=\n]*)?)$/;

    formData.append("bg", inputElement.value);

    try {
      const newBg = formData.get("bg") as string;

      if (!discordRegex.test(newBg)) {
        setInputError("Invalid Discord link format");
        return;
      }

      setLoading(true);

      await editBackground({
        session: session,
        tag: tag,
        newBackground: newBg,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Image className="cursor-pointer text-foreground/50 transition-colors hover:text-foreground" />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={handleChangeBg}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Here you can change the background of the tag!
            </AlertDialogTitle>
            <AlertDialogDescription>
              Currently, we only accept links in .gif/.webp/.png/.jpg format
              from Discord
            </AlertDialogDescription>
            <Input name="bg" />
            {inputError && <p className="text-red-500">{inputError}</p>}
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type="submit">
              {loading ? <Loader2 className=" animate-spin" /> : "Submit"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EditBackground;
