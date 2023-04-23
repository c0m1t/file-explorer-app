import * as React from "react";
import Button from "../Button";
import { useToast } from "../useToast";
import { FileManagerContext } from "./FileManagerContext";
import FileManagerPane from "./FileManagerPane";
import FileManagerTreeView from "./FileManagerTreeView";
import {
  FileSystemNodeId,
  FileSystemNodeInfo,
  FileSystemNodesData,
  convertFileSystemObjectToMap,
  getFileSystemNodeChildrenNodes,
  getFileSystemNodeFullName,
} from "@/lib/fileSystem";
import { ChevronLeft, ChevronRight, SidebarClose } from "lucide-react";

export interface FileManagerProps extends React.HTMLAttributes<HTMLDivElement> {
  data: FileSystemNodesData;
}

export default function FileManager(props: FileManagerProps) {
  const { className, data, ...rest } = props;

  const [map] = React.useState(() => {
    return convertFileSystemObjectToMap(data);
  });

  const [history, setHistory] = React.useState<Array<FileSystemNodeId | null>>([
    null,
  ]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = React.useState(0);

  const currentFolderId = history[currentHistoryIndex];
  const currentFolderNode = map.get(currentFolderId);

  if (!currentFolderNode) {
    console.warn(`Folder with id ${currentFolderId} was not found.`);
  }

  const { toast } = useToast();

  const currentFolderChildren = React.useMemo(() => {
    return getFileSystemNodeChildrenNodes(map, currentFolderId);
  }, [map, currentFolderId]);

  const navigateTo = (id: FileSystemNodeId) => {
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
    <FileManagerContext.Provider
      value={{
        currentFolderId,
        currentFolderChildren,
        currentFolderNode,
        map,
        navigateTo,
      }}
    >
      <div
        {...rest}
        className="flex h-full select-none flex-col rounded border"
      >
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
            {currentFolderNode
              ? getFileSystemNodeFullName(currentFolderNode)
              : ""}
          </span>
        </div>
        <div className="flex w-full flex-1 overflow-hidden text-clip">
          <div className="w-[250px] shrink-0 border-r">
            <FileManagerTreeView
              currentFolderId={currentFolderId}
              map={map}
              openNode={openNode}
            />
          </div>
          <FileManagerPane
            className="w-[0px] flex-1"
            currentFolderChildren={currentFolderChildren}
            openNode={openNode}
          />
        </div>
      </div>
    </FileManagerContext.Provider>
  );
}
