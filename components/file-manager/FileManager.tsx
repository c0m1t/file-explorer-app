import * as React from "react";
import Button from "../Button";
import { useToast } from "../useToast";
import FileManagerPane from "./FileManagerPane";
import FileManagerTreeView from "./FileManagerTreeView";
import getFileSystemNodeFullName from "@/lib/getFileSystemNodeFullName";
import { getChildrenArrayNodes } from "@/lib/normalizeData";
import { ChevronLeft, ChevronRight, SidebarClose } from "lucide-react";

export type FileSystemNodeType = "file" | "folder";

export interface FileSystemNodeInfo {
  children?: string[]; // We could have an array of nodes instead of ids instead.
  ext?: string;
  id: string;
  name: string;
  parent: string | null;
  type: FileSystemNodeType;
}

export type FileSystemNodesData = Record<string, FileSystemNodeInfo>;

export interface FileManagerProps extends React.HTMLAttributes<HTMLDivElement> {
  data: FileSystemNodesData;
}

export default function FileManager(props: FileManagerProps) {
  const { className, data, ...rest } = props;

  const [history, setHistory] = React.useState<Array<string | null>>([null]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = React.useState(0);

  const currentFolderId = history[currentHistoryIndex];

  const { toast } = useToast();

  const currentNodes = React.useMemo(() => {
    return getChildrenArrayNodes(data, currentFolderId);
  }, [data, currentFolderId]);

  const navigateTo = (id: string) => {
    setHistory((history) => [...history.slice(0, currentHistoryIndex + 1), id]);
    setCurrentHistoryIndex((currentHistoryIndex) => currentHistoryIndex + 1);
  };

  const handleBack = () => {
    setCurrentHistoryIndex((currentHistoryIndex) => {
      if (currentHistoryIndex > 0) {
        return currentHistoryIndex - 1;
      }

      return currentHistoryIndex;
    });
  };

  const handleNext = () => {
    setCurrentHistoryIndex((currentHistoryIndex) => {
      if (currentHistoryIndex < history.length) {
        return currentHistoryIndex + 1;
      }

      return currentHistoryIndex;
    });
  };

  const openNode = (node: FileSystemNodeInfo) => {
    if (node.type === "folder") {
      navigateTo(node.id);

      return;
    }

    toast({
      description: "opening " + getFileSystemNodeFullName(node),
    });
  };

  return (
    <div {...rest} className="flex h-full select-none flex-col rounded border">
      <div className="flex min-h-[64px] w-full items-center justify-between border-b bg-accent p-3">
        <div className="hidden items-center sm:flex">
          <Button>
            <SidebarClose size={0.5} />
          </Button>
          <Button
            className="mr-4"
            disabled={currentHistoryIndex === 0}
            onClick={handleBack}
            title="Back"
          >
            <ChevronLeft />
            <span className="sr-only">Back</span>
          </Button>
          <Button
            className="mr-4"
            disabled={currentHistoryIndex === history.length - 1}
            onClick={handleNext}
            title="Next"
          >
            <ChevronRight />
            <span className="sr-only">Next</span>
          </Button>
        </div>
        <span className="flex-1 overflow-hidden truncate">
          {currentFolderId ? data[currentFolderId].name : "root"}
        </span>
        {/* <div className="hidden items-center px-2  md:flex">
          <div className="mr-2 rounded bg-background p-2">
            <LucideList size={20} />
            <span className="sr-only">Show items in a list</span>
          </div>
          <div className="bg-accent p-2 opacity-50">
            <LucideLayoutGrid size={20} />
            <span className="sr-only">Show items as icons</span>
          </div>
        </div> */}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-[250px] border-r">
          <FileManagerTreeView
            currentFolderId={currentFolderId}
            data={data}
            openNode={openNode}
          />
        </div>
        <FileManagerPane
          className="flex-1"
          nodes={currentNodes}
          openNode={openNode}
        />
      </div>
    </div>
  );
}
