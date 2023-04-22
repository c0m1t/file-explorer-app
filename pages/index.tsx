import * as React from "react";
import Button from "@/components/Button";
import { getDefaultLayout } from "@/components/DefaultLayout";
import Spinner from "@/components/Spinner";
import FileManager, {
  FileSystemNodesData,
} from "@/components/file-manager/FileManager";
import { useToast } from "@/components/useToast";
import fetcher from "@/lib/fetcher";
import useSWR from "swr";

const REFETCH_INTERVAL = 30 * 1000;

interface HomeProps {}

export default function Home(props: HomeProps) {
  const { toast } = useToast();

  const {
    data: { data, lastUpdatedAt } = {},
    mutate,
    isValidating,
  } = useSWR<{ data: FileSystemNodesData; lastUpdatedAt: number }>(
    "api/list",
    async () => {
      const data = await fetcher<FileSystemNodesData>("api/list");

      return {
        data,
        lastUpdatedAt: Date.now(),
      };
    },
    {
      revalidateIfStale: false,
      revalidateOnFocus: true,
      revalidateOnReconnect: false,
      focusThrottleInterval: 0, // We could change this.
      shouldRetryOnError: false,
      keepPreviousData: true,
      onError: async (error) => {
        let description = "Unknown error has occurred.";

        try {
          description = await error.json();
        } catch {
          //
        }

        toast({
          description,
        });
      },
    }
  );

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      mutate();
    }, REFETCH_INTERVAL);

    return () => {
      clearInterval(intervalId);
    };
  }, [mutate]);

  return (
    <div className="my-6 h-[600px] px-6">
      <div className="mb-4 flex items-center">
        <Button
          className="mr-2"
          disabled={isValidating}
          onClick={() => {
            mutate();
          }}
          variant="secondary"
        >
          Update
        </Button>
        <span className="mr-2 text-sm">
          <span>Last updated at </span>
          {lastUpdatedAt ? (
            <time dateTime={new Date(lastUpdatedAt).toISOString()}>
              {new Date(lastUpdatedAt).toLocaleTimeString()}
            </time>
          ) : (
            ""
          )}
        </span>
        {isValidating && <Spinner />}
      </div>

      <FileManager
        className="h-[600px]"
        data={data ?? {}}
        key={lastUpdatedAt}
      />
    </div>
  );
}

Home.getLayout = getDefaultLayout;
