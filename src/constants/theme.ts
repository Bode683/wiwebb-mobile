/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 */

import { Platform } from "react-native";

// Wiwebb Brand Colors
// Primary: oklch(57% 0.22 250) ≈ #4d3ddb (purple-blue)
// Secondary: oklch(60% 0.15 50) ≈ #db9f4d (orange-yellow)
const tintColorLight = "#4d3ddb";
const tintColorDark = "#6d5df5";

export const Colors = {
  light: {
    text: "#374151", // Darker text for better readability
    background: "#ffffff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    primary: "#4d3ddb", // Wiwebb purple-blue
    secondary: "#db9f4d", // Wiwebb orange-yellow
    success: "#10b981",
    warning: "#f59e0b",
    error: "#ef4444",
    muted: "#f3f4f6",
    card: "#ffffff",
    border: "#d1d5db", // Updated border color
    input: "#f9fafb",
    overlay: "rgba(0,0,0,0.4)",
    skeleton: "#e5e7eb",
    textMuted: "#6b7280",
    backgroundElevated: "#f9fafb",
    surface: "#f9fafb",
    accent: "#f0ab5c", // Lighter accent based on secondary
    onPrimary: "#ffffff",
  },
  dark: {
    text: "#ECEDEE",
    background: "#0f172a", // Darker background
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    primary: "#6d5df5", // Lighter purple for dark mode
    secondary: "#f0ab5c", // Lighter orange for dark mode
    success: "#22c55e",
    warning: "#fbbf24",
    error: "#f87171",
    muted: "#1e293b",
    card: "#1e293b",
    border: "#334155",
    input: "#1e293b",
    overlay: "rgba(0,0,0,0.7)",
    skeleton: "#334155",
    textMuted: "#94a3b8",
    backgroundElevated: "#0b1120",
    surface: "#1e293b",
    accent: "#db9f4d",
    onPrimary: "#ffffff",
  },
} as const;

type FontSet = { sans: string; serif: string; rounded: string; mono: string };

export const Fonts: FontSet = Platform.select<FontSet>({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
})!;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const Radii = {
  sm: 4,
  md: 8,
  lg: 12,
  full: 9999,
} as const;

export const Elevation = {
  0: 0,
  1: 2,
  2: 4,
  3: 8,
  4: 12,
} as const;

export const Opacity = {
  disabled: 0.5,
  hover: 0.8,
  focus: 0.9,
} as const;

export const Z = {
  dropdown: 1000,
  modal: 1100,
  toast: 1200,
} as const;

export const Typography = {
  h1: {
    fontFamily: Fonts.sans,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "700",
  },
  h2: {
    fontFamily: Fonts.sans,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
  },
  h3: {
    fontFamily: Fonts.sans,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "600",
  },
  body: {
    fontFamily: Fonts.sans,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: "400",
  },
  caption: {
    fontFamily: Fonts.sans,
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "400",
  },
  mono: {
    fontFamily: Fonts.mono,
    fontSize: 14,
    lineHeight: 18,
    fontWeight: "400",
  },
} as const;

export type ColorScheme = keyof typeof Colors;

export type Theme = {
  scheme: ColorScheme;
  colors: (typeof Colors)[ColorScheme];
  spacing: typeof Spacing;
  radii: typeof Radii;
  elevation: typeof Elevation;
  opacity: typeof Opacity;
  z: typeof Z;
  typography: typeof Typography;
  fonts: typeof Fonts;
};

export function getTheme(scheme: ColorScheme): Theme {
  return {
    scheme,
    colors: Colors[scheme],
    spacing: Spacing,
    radii: Radii,
    elevation: Elevation,
    opacity: Opacity,
    z: Z,
    typography: Typography,
    fonts: Fonts,
  } as const;
}

export const navigationLightTheme = {
  dark: false,
  colors: {
    primary: Colors.light.primary,
    background: Colors.light.background,
    card: Colors.light.card,
    text: Colors.light.text,
    border: Colors.light.border,
    notification: Colors.light.error,
  },
} as const;

export const navigationDarkTheme = {
  dark: true,
  colors: {
    primary: Colors.dark.primary,
    background: Colors.dark.background,
    card: Colors.dark.card,
    text: Colors.dark.text,
    border: Colors.dark.border,
    notification: Colors.dark.error,
  },
} as const;
