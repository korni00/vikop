import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface SkeletonVariants {
  default: React.ReactNode;
  tag: React.ReactNode;
  user: React.ReactNode;
}

const useSkeleton = (variant: keyof SkeletonVariants) => {
  const [skeleton, setSkeleton] = useState<React.ReactNode>(<div />);

  useEffect(() => {
    const variants: SkeletonVariants = {
      default: (
        <div className="flex h-[calc(100vh-52px)] flex-col">
          <Skeleton className="h-[180px] w-full " />
        </div>
      ),
      tag: (
        <div className="flex h-[calc(100vh-52px)] flex-col">
          <div className=" flex w-full flex-col gap-2">
            <Skeleton className="h-[180px] w-full "></Skeleton>
            <Skeleton className="h-[36px] w-[140px] rounded-none "></Skeleton>
            <Skeleton className="mt-4 h-[100px] w-full"></Skeleton>
            <span className="flex w-full justify-end gap-2">
              <Skeleton className="h-[36px] w-[77px]"></Skeleton>
              <Skeleton className="h-[36px] w-[77px]"></Skeleton>
            </span>
          </div>
          <div className="flex h-full w-full items-center justify-center ">
            <Loader2 className=" animate-spin" />
          </div>
        </div>
      ),
      user: (
        <div className="flex h-[calc(100vh-52px)] flex-col">
          <div className=" flex w-full flex-col gap-2">
            <Skeleton className="h-[180px] w-full "></Skeleton>
            <div className="ml-8">
              <div className="relative mt-[-80px] flex flex-row items-center gap-2">
                <Skeleton className="h-24 w-24 rounded-full" />
                <span className="flex flex-col items-start justify-center gap-2">
                  <Skeleton className="h-[30px] w-[120px] rounded-none"></Skeleton>
                </span>
              </div>
              <Skeleton className="ml-2 mt-2 h-[36px] w-[210px] rounded-md"></Skeleton>
            </div>
          </div>
          <div className="flex h-full w-full items-center justify-center ">
            <Loader2 className=" animate-spin" />
          </div>
        </div>
      ),
    };

    setSkeleton(variants[variant] || variants.default);
  }, [variant]);

  return skeleton;
};

export default useSkeleton;
