import * as React from "react";
import FileManagerNodeIcon from "./FileManagerNodeIcon";
import FileManagerPathBar from "./FileManagerPathBar";
import FileManagerStatusBar from "./FileManagerStatusBar";
import cn from "@/lib/cn";
import {
  FileSystemNodeId,
  FileSystemNodeInfo,
  getFileSystemNodeFullName,
} from "@/lib/fileSystem";

export interface FileManagerPaneProps {
  className?: string;
  currentFolderChildren: Array<FileSystemNodeInfo>;
  openNode: (node: FileSystemNodeInfo) => void;
}

export default function FileManagerPane(props: FileManagerPaneProps) {
  const { openNode, currentFolderChildren, className } = props;

  const [focusedId, setfocusedId] = React.useState<FileSystemNodeId | null>(
    null
  );

  const focusedNode = currentFolderChildren.find(
    (node) => node.id === focusedId
  );

  const getNextNode = (id: FileSystemNodeId) => {
    const index = currentFolderChildren.findIndex((node) => node.id === id);

    if (index < currentFolderChildren.length - 1) {
      return currentFolderChildren[index + 1].id;
    }

    return id;
  };

  const getPreviousNode = (id: FileSystemNodeId) => {
    const index = currentFolderChildren.findIndex((node) => node.id === id);

    if (index > 0) {
      return currentFolderChildren[index - 1].id;
    }

    return id;
  };

  const focusNode = (event: React.SyntheticEvent, id: FileSystemNodeId) => {
    if (id === null) {
      return;
    }

    document.getElementById(id)?.focus();

    if (id) {
      setfocusedId(id);
    }
  };

  const focuseNextNode = (event: React.SyntheticEvent, id: FileSystemNodeId) =>
    focusNode(event, getNextNode(id));

  const focusPreviousNode = (
    event: React.SyntheticEvent,
    id: FileSystemNodeId
  ) => focusNode(event, getPreviousNode(id));

  const handleKeyDown = (event: React.KeyboardEvent) => {
    const key = event.key;

    if (!focusedId) {
      return;
    }

    switch (key) {
      case "Enter":
        if (focusedNode) {
          openNode(focusedNode);
        }
        // event.stopPropagation();
        break;
      case "ArrowDown":
        focuseNextNode(event, focusedId);
        break;
      case "ArrowUp":
        focusPreviousNode(event, focusedId);
        break;
    }
  };

  const handleFocus = (event: React.FocusEvent, id: string) => {
    focusNode(event, id);
  };

  const handleBlur = (event: React.FocusEvent) => {
    setfocusedId(null);
  };

  const handleDoubleClick = (
    event: React.MouseEvent,
    node: FileSystemNodeInfo
  ) => {
    openNode(node);
  };

  return (
    <div className={cn("flex h-full w-full flex-col", className)}>
      <div className="flex-1 overflow-auto">
        <table className="w-full" role="grid" tabIndex={-1}>
          <colgroup>
            <col className="w-[36px]" />
            <col />
          </colgroup>

          <thead className="sticky bg-background">
            <tr className="border-b border-slate-200 shadow-sm dark:border-slate-400/20">
              <th></th>
              <th className="border-b border-slate-200 text-start dark:border-slate-400/20">
                Name
              </th>
            </tr>
          </thead>
          <tbody onKeyDown={handleKeyDown}>
            {currentFolderChildren.map((node, index) => {
              if (node.id === null) {
                console.error(
                  "Root item should not be rendered in the manager pane."
                );

                return null;
              }
              return (
                <tr
                  aria-rowindex={index}
                  className={cn("text-lg hover:bg-accent", {
                    "bg-ring": focusedId === node.id,
                  })}
                  id={node.id}
                  key={node.id}
                  onBlur={handleBlur}
                  onDoubleClick={(event) => handleDoubleClick(event, node)}
                  onFocus={(event) =>
                    handleFocus(
                      event,
                      // FIXME:
                      node.id as string
                    )
                  }
                  tabIndex={0}
                >
                  <td className="pl-3">
                    <span>
                      <FileManagerNodeIcon ext={node.ext} size={0.8} />
                    </span>
                  </td>
                  <td>
                    <span className="overflow-hidden truncate">
                      {
                        //FIXME: Even when the file name is truncated, show the extension
                        getFileSystemNodeFullName(node)
                      }
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <FileManagerPathBar />
      <FileManagerStatusBar />
    </div>
  );
}
