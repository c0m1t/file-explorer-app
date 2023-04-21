import { getDefaultLayout } from "@/components/DefaultLayout";
import FileManager from "@/components/file-manager/FileManager";
import { data } from "@/lib/data";
import { normalizeData } from "@/lib/normalizeData";

export default function Home() {
  const normalizedData = normalizeData(data);

  return (
    <div className="my-6 h-[600px] px-6">
      <FileManager className="h-[600px]" data={normalizedData} />
    </div>
  );
}

Home.getLayout = getDefaultLayout;
