import { ThemeSelect } from "./ThemeSelect";

export type DefaultLayoutProps = {
  children: React.ReactNode;
};

export default function DefaultLayout(props: DefaultLayoutProps) {
  const { children } = props;

  return (
    <div
      className="relative m-0 my-auto max-w-full"
      style={{ paddingTop: "var(--header-height)" }}
    >
      <header
        className="fixed top-0 flex w-full flex-col justify-center border-b p-6"
        style={{
          background: "var(--background-start-rgb)",
          height: "var(--header-height)",
        }}
      >
        <ThemeSelect />
      </header>
      <main className="my-6 px-6">{children}</main>
    </div>
  );
}

export const getDefaultLayout = (page: React.ReactElement) => (
  <DefaultLayout>{page}</DefaultLayout>
);
