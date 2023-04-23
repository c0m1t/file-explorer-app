export type FileSystemNodeId = string | null;
export type FileSystemNodeType = "file" | "folder";

export interface FileSystemNodeInfo<T = FileSystemNodeId> {
  children?: string[]; // We could have an array of nodes instead of ids instead.
  ext?: string;
  id: T;
  name: string;
  parent: T | null;
  type: FileSystemNodeType;
}

export type FileSystemNodesData = Record<string, FileSystemNodeInfo<string>>;
export type FileSystemNodesMap = Map<FileSystemNodeId, FileSystemNodeInfo>;

export function convertFileSystemObjectToMap(data: FileSystemNodesData) {
  const entries: [FileSystemNodeId, FileSystemNodeInfo][] =
    Object.entries(data);

  const rootChildren = [];

  for (const id in data) {
    const node = data[id];

    if (node.parent === null) {
      rootChildren.push(id);
    }
  }

  entries.push([
    null,
    {
      id: null,
      name: "root",
      get parent() {
        throw new Error("You cannot access parent property on the root node.");

        return "";
      },
      type: "folder",
      children: rootChildren,
    },
  ]);

  return new Map<FileSystemNodeId, FileSystemNodeInfo>(entries);
}

export function getFileSystemNodeFullName(node: FileSystemNodeInfo) {
  const { ext, name } = node;

  return name + (ext ? `.${ext}` : "");
}

export function getFileSystemNodeChildrenNodes(
  map: FileSystemNodesMap,
  id: FileSystemNodeId
): FileSystemNodeInfo[] {
  const childrenArray: FileSystemNodeInfo[] = [];
  const parentNode = map.get(id);

  if (parentNode) {
    parentNode.children?.forEach((id) => {
      const node = map.get(id);

      if (node) {
        childrenArray.push(node);
      } else {
        console.warn(`There is no node with id of ${id}`);
      }
    });
  } else {
    console.warn(`There is no node with id of ${id}`);
  }

  return childrenArray;
}

export function getFileSystemNodeAndAncestorsIds(
  map: FileSystemNodesMap,
  id: FileSystemNodeId
): FileSystemNodeId[] {
  const ids: FileSystemNodeId[] = [];

  let node = map.get(id);

  while (node) {
    ids.push(node.id);

    if (node.id === null) {
      return ids;
    }

    node = map.get(node.parent);
  }

  return ids;
}
