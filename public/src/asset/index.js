import avatarIcon from "./avatar.svg";
import chatGeminiIcon from "./gemini.svg";
import geminiLoader from "./loader.gif";

import {darkIcon} from "./darkIcon/darkIcon";
import {lightIcon} from "./lightIcon/lightIcon";

export const commonIcon = {
  avatarIcon,
  chatGeminiIcon,
  geminiLoader,
};

export const themeIcon = () => {
  const localTheme = localStorage.getItem("theme") || "dark";
  return localTheme === "dark" ? darkIcon : lightIcon;
};