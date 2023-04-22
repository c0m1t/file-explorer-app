import { FileSystemNodeInfo } from "@/components/file-manager/FileManager";

const ROOT_NAME = "root";

export default function getFileSystemNodeFullName(
  node: FileSystemNodeInfo | null
) {
  if (node === null) {
    return ROOT_NAME;
  }
  const { ext, name } = node;

  return name + (ext ? `.${ext}` : "");
}
