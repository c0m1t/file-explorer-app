import { useFileManagerContext } from "./FileManagerContext";

export interface FileManagerStatusBarProps
  extends React.HTMLProps<HTMLDivElement> {}

export default function FileManagerStatusBar(props: FileManagerStatusBarProps) {
  const { currentFolderChildren } = useFileManagerContext();

  return (
    <div className="bg-accent px-4 py-1 text-center text-xs">
      {currentFolderChildren?.length ?? 0} items
    </div>
  );
}
