import * as React from "react";
import * as TreeView from "../tree-view";
import FileManagerNodeIcon from "./FileManagerNodeIcon";
import cn from "@/lib/cn";
import {
  FileSystemNodeInfo,
  FileSystemNodesMap,
  getFileSystemNodeChildrenNodes,
  getFileSystemNodeFullName,
} from "@/lib/fileSystem";

export interface FileManagerTreeViewProps {
  className?: string;
  currentFolderId: string | null;
  map: FileSystemNodesMap;
  openNode: (node: FileSystemNodeInfo) => void;
}

export default function FileManagerTreeView(props: FileManagerTreeViewProps) {
  const { map, openNode, className } = props;

  const children = getFileSystemNodeChildrenNodes(map, null);

  return (
    <TreeView.Root className={cn("h-full overflow-auto", className)} map={map}>
      {renderTree(children, map, openNode)}
    </TreeView.Root>
  );
}

function renderTree(
  children: FileSystemNodeInfo[],
  map: FileSystemNodesMap,
  openNode: (node: FileSystemNodeInfo) => void
) {
  return (
    <React.Fragment>
      {children.map((node) => {
        const fileName = getFileSystemNodeFullName(node);
        return (
          <TreeView.Item
            key={node.id}
            label={
              <span className="flex items-center text-accent-1">
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
            nodeId={
              //FIXME:
              node.id as string
            }
            onDoubleClick={(event) => {
              openNode(node);

              event.stopPropagation();
            }}
          >
            {Array.isArray(node.children)
              ? renderTree(
                  node.children
                    .map((id) => map.get(id))
                    .filter(Boolean) as FileSystemNodeInfo[],
                  map,
                  openNode
                )
              : null}
          </TreeView.Item>
        );
      })}
    </React.Fragment>
  );
}
