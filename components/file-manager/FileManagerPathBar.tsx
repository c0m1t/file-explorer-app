import * as React from "react";
import Button from "../Button";
import { useFileManagerContext } from "./FileManagerContext";
import cn from "@/lib/cn";
import { getFileSystemNodeAndAncestorsIds } from "@/lib/fileSystem";
import { ChevronRight } from "lucide-react";

export interface FileManagerPathBarProps
  extends React.HTMLProps<HTMLDivElement> {}

export default function FileManagerPathBar(props: FileManagerPathBarProps) {
  const { currentFolderId, map, navigateTo } = useFileManagerContext();

  const pathIds = getFileSystemNodeAndAncestorsIds(map, currentFolderId);

  const findIndicesWithLessShrinkValue = (): number[] => {
    const length = pathIds.length;

    if (length <= 1) {
      return [];
    }

    return [length - 1, length - 2];
  };

  return (
    <div className="flex flex-nowrap items-center border-t px-2 py-1 text-xs">
      {pathIds.reverse().map((id, index) => {
        return (
          <React.Fragment key={id}>
            <Button
              className={cn(
                "block shrink overflow-hidden truncate whitespace-nowrap py-0.5 transition duration-1000 ease-in-out",
                {
                  ["hover:shrink-[0.05]"]: index !== 0,
                  ["shrink-[0.4]"]:
                    findIndicesWithLessShrinkValue().includes(index),
                  ["shrink-0"]: index === 0,
                }
              )}
              onClick={() => {
                navigateTo(id);
              }}
            >
              {map.get(id)?.name}
            </Button>
            {index !== pathIds.length - 1 && (
              <span>
                <ChevronRight size={16} />
              </span>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
