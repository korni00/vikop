"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createPost } from "../server/create-post";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/text-area";
import { Loader2 } from "lucide-react";
import { MAX_TAGS, MAX_TAG_LENGTH } from "@/lib/settings";

const CreatePost = ({
  onPostCreate,
  postPlaceholder,
}: {
  onPostCreate?: () => void;
  postPlaceholder?: string;
}) => {
  const { data: session, status } = useSession();
  const [tags, setTags] = useState<string[]>([]);
  const [content, setContent] = useState<string>(postPlaceholder || "");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleTagInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    const regex = /#(\w+)/g;
    const matches = inputValue.match(regex);
    const newTags = matches
      ? matches.map((match) => match.substring(1)).slice(0, MAX_TAGS)
      : [];

    const uniqueTags = Array.from(new Set(newTags))
      .filter((tag) => tag.length <= MAX_TAG_LENGTH)
      .slice(0, MAX_TAGS);

    setTags(uniqueTags);
    setContent(inputValue);
  };

  const handleSubmitForm = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      setIsSubmitting(true);
      setError(null);

      const formData = new FormData(event.target as HTMLFormElement);
      const contentFromFormData = formData.get("content") as string;

      await createPost({ session, content: contentFromFormData, tags });
      setTags([]);
      setContent("");
      if (onPostCreate) {
        onPostCreate();
      }
    } catch (error) {
      setError("Failed to create post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isContentValid = content.length >= 3 && content.length <= 3000;

  return (
    <form
      className="mb-2 flex  flex-col items-end gap-2 rounded-lg bg-default px-4  py-2"
      onSubmit={handleSubmitForm}
    >
      <Textarea
        name="content"
        className="max-h-[200px] min-h-[100px] bg-card"
        disabled={!session?.user}
        placeholder={
          status === "loading"
            ? "Loading..."
            : session?.user
              ? "Type post..."
              : "Please login"
        }
        value={content}
        onChange={handleTagInput}
      />
      <div className=" flex w-full justify-between gap-2 overflow-hidden">
        <span className="flex gap-2">
          {tags.map((tag, index) => (
            <Badge key={index} className="mr-1">
              #{tag}
            </Badge>
          ))}
        </span>
        <span className="flex items-center justify-center gap-2">
          {error && <p className="text-red-500">{error}</p>}
          <Button
            variant="link"
            disabled={!isContentValid}
            onClick={() => setContent("")}
          >
            Clear
          </Button>

          <Button
            type="submit"
            disabled={isSubmitting || !session?.user || !isContentValid}
          >
            {isSubmitting ? <Loader2 className=" animate-spin" /> : "Submit"}
          </Button>
        </span>
      </div>
    </form>
  );
};

export default CreatePost;
