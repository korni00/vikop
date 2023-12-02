import Link from "next/link";
import React from "react";

const useHighlightTags = (text: string) => {
  const highlightTags = () => {
    const tagRegex = /#[^\s]+/g;
    const parts = text.split(tagRegex);
    const tags = text.match(tagRegex);

    if (tags) {
      return parts.map((part, index) => {
        const tag = tags[index - 1];
        return (
          <React.Fragment key={index}>
            {index > 0 && tag !== undefined && (
              <Link
                className="text-emerald-400 transition-colors hover:text-emerald-600"
                href={`/tag/${tag.substring(1)}`}
                passHref
              >
                {tag}
              </Link>
            )}
            {part}
          </React.Fragment>
        );
      });
    }

    return text;
  };

  return {
    highlightTags,
  };
};

export default useHighlightTags;
