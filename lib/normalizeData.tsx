import { DataNode } from "./data";
import { FileSystemNodeType, FileSystemNodesData } from "./fileSystem";

export function normalizeData(nodes: DataNode[]): FileSystemNodesData {
  const map: FileSystemNodesData = {};

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
