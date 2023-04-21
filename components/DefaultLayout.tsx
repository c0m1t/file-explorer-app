import { ThemeSelect } from "./ThemeSelect";

export type DefaultLayoutProps = {
  children: React.ReactNode;
};

export default function DefaultLayout(props: DefaultLayoutProps) {
  const { children } = props;

  return (
    <div
      className="relative m-0 my-auto min-h-screen max-w-full"
      style={{ paddingTop: "var(--header-height)" }}
    >
      <header
        className="fixed top-0 flex w-full flex-col justify-center border-b bg-background p-6"
        style={{
          height: "var(--header-height)",
        }}
      >
        <ThemeSelect />
      </header>
      {children}
    </div>
  );
}

export const getDefaultLayout = (page: React.ReactElement) => (
  <DefaultLayout>{page}</DefaultLayout>
);
