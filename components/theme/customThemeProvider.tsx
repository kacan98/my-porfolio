"use client";
import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { StylesSettings } from "@/sanity/schemaTypes/singletons/stylesSettings";
import { getTheme } from "@/app/theme";

type CustomThemeProviderProps = {
  children: React.ReactNode;
  styles?: StylesSettings;
  forceMode?: "light" | "dark";
  forceSmallerBreakpoints?: boolean;
};

function CustomThemeProvider({
  children,
  styles,
  forceMode,
  forceSmallerBreakpoints,
}: CustomThemeProviderProps) {
  const theme = getTheme({ styles, forceMode, forceSmallerBreakpoints });
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default CustomThemeProvider;
