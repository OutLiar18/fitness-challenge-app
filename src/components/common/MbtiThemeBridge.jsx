import { useEffect } from "react";

import usePlayerData from "../../hooks/usePlayerData";
import { getMbtiThemeByType } from "../../constants/mbtiThemes";

const THEME_PROPERTIES = Object.freeze({
  primaryControl: "--mbti-primary-control",
  primaryBright: "--mbti-primary-bright",
  secondary: "--mbti-secondary",
  secondaryBright: "--mbti-secondary-bright",
});

function clearMbtiTheme(root) {
  root.removeAttribute("data-mbti-theme");
  for (const property of Object.values(THEME_PROPERTIES)) {
    root.style.removeProperty(property);
  }
}

export default function MbtiThemeBridge() {
  const { profile } = usePlayerData();
  const mbtiType = profile?.mbtiType ?? "";

  useEffect(() => {
    const root = document.documentElement;
    const theme = getMbtiThemeByType(mbtiType);

    clearMbtiTheme(root);

    if (!theme) {
      return undefined;
    }

    root.dataset.mbtiTheme = theme.type;
    for (const [key, property] of Object.entries(THEME_PROPERTIES)) {
      root.style.setProperty(property, theme[key]);
    }

    return () => {
      clearMbtiTheme(root);
    };
  }, [mbtiType]);

  return null;
}
