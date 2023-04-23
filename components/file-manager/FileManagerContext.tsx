import * as React from "react";
import {
  FileSystemNodeId,
  FileSystemNodeInfo,
  FileSystemNodesMap,
} from "@/lib/fileSystem";

export interface FileManagerContextValue {
  currentFolderChildren?: FileSystemNodeInfo[];
  currentFolderId: string | null;
  currentFolderNode?: FileSystemNodeInfo | null;
  map: FileSystemNodesMap;
  navigateTo: (id: FileSystemNodeId) => void;
}

export const FileManagerContext = React.createContext<
  FileManagerContextValue | undefined
>(undefined);

export function useFileManagerContext() {
  const context = React.useContext(FileManagerContext);

  if (!context) {
    throw Error(
      "The useFileManagerContext hook must be called inside FileManagerContext Provider."
    );
  }

  return context;
}
