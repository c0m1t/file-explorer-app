import { DataNode } from "./data";
import {
  FileSystemNodeInfo,
  FileSystemNodeType,
} from "@/components/file-manager/FileManager";

export function normalizeData(
  nodes: DataNode[]
): Record<string, FileSystemNodeInfo> {
  const map: Record<string, FileSystemNodeInfo> = {};

  // Populate
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const clonedNode = { ...node };

    map[node.id] = clonedNode;

    if (map[node.id].type === "folder") {
      map[node.id].children = [];
    }
  }

  // Assign children ids
  for (let i = 0; i < nodes.length; i++) {
    const node = map[nodes[i].id];

    if (node.parent) {
      const parentNode = map[node.parent];

      if (!parentNode.children) {
        parentNode.children = [node.id];
      } else {
        parentNode.children?.push(node.id);
      }
    }
  }

  return map;
}

export function getChildrenArrayNodes(
  nodes: Record<string, FileSystemNodeInfo>,
  parentId: string | null
): FileSystemNodeInfo[] {
  const childrenArray: FileSystemNodeInfo[] = [];

  // TODO:
  if (parentId === null) {
    for (const id in nodes) {
      const node = nodes[id];

      if (node.parent === null) {
        childrenArray.push(nodes[id]);
      }
    }
    return childrenArray;
  }

  const parentNode = nodes[parentId];

  parentNode.children?.forEach((id) => {
    childrenArray.push(nodes[id]);
  });

  return childrenArray;
}

// We could use nested data structure instead of normalizing data
interface FileSystemNodeNested {
  children?: FileSystemNodeNested[];
  ext?: string;
  id: string;
  name: string;
  type: FileSystemNodeType;
}

export function transformDataToNestedDataStructure(
  nodes: DataNode[],
  parentId: string | null = null
): FileSystemNodeNested[] {
  const childNodes = nodes.filter((node) => node.parent === parentId);

  return childNodes.map((child: DataNode) => {
    if (child.type === "file") {
      return {
        ext: child.ext,
        id: child.id,
        name: child.name,
        type: "file",
      };
    }

    const children = transformDataToNestedDataStructure(
      nodes,
      child.id
    ) as FileSystemNodeNested[];

    return {
      id: child.id,
      name: child.name,
      children: children.length ? children : [],
      type: "folder",
    };
  });
}
