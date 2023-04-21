import * as React from "react";
import * as TreeView from "../tree-view";
import { FileSystemNodeInfo } from "./FileManager";
import FileManagerNodeIcon from "./FileManagerNodeIcon";
import cn from "@/lib/cn";
import { getChildrenArrayNodes } from "@/lib/normalizeData";

export interface FileManagerTreeViewProps {
  className?: string;
  currentFolderId: string | null;
  data: Record<string, FileSystemNodeInfo>;
  openNode: (node: FileSystemNodeInfo) => void;
}

export default function FileManagerTreeView(props: FileManagerTreeViewProps) {
  const { currentFolderId, data, openNode, className } = props;

  const rootNodesArray = getChildrenArrayNodes(data, null);

  return (
    <TreeView.Root className={cn("h-full overflow-auto", className)} map={data}>
      {renderTree(rootNodesArray, data, openNode)}
    </TreeView.Root>
  );
}

function renderTree(
  array: FileSystemNodeInfo[],
  data: Record<string, FileSystemNodeInfo>,
  openNode: (node: FileSystemNodeInfo) => void
) {
  return (
    <React.Fragment>
      {array.map((node) => {
        const fileName = node.name + (node.ext ? `.${node.ext}` : "");
        return (
          <TreeView.Item
            key={node.id}
            label={
              <span className="flex items-center">
                <span className="mr-1">
                  <FileManagerNodeIcon ext={node.ext} size={0.7} />
                </span>
                <span className="overflow-hidden truncate" title={fileName}>
                  {
                    //FIXME: Even when the file name is truncated, show the extension
                    fileName
                  }
                </span>
              </span>
            }
            nodeId={node.id}
            onDoubleClick={(event) => {
              openNode(node);

              event.stopPropagation();
            }}
          >
            {Array.isArray(node.children)
              ? renderTree(
                  node.children.map((id) => data[id]),
                  data,
                  openNode
                )
              : null}
          </TreeView.Item>
        );
      })}
    </React.Fragment>
  );
}
