export default function getFileSystemNodeFullName({
  name,
  ext,
}: {
  ext?: string;
  name: string;
}) {
  return name + (ext ? `.${ext}` : "");
}
