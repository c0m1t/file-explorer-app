import * as React from "react";
import { useTheme as useNextThemesTheme } from "next-themes";

export default function useTheme() {
  const { theme, ...other } = useNextThemesTheme();
  const [runtimeTheme, setRuntimeTheme] = React.useState<string | undefined>(
    "system"
  );

  React.useEffect(() => {
    setRuntimeTheme(theme ?? "system");
  }, [theme]);

  return { ...other, theme: runtimeTheme };
}
