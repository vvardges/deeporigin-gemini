import { createSlice } from "@reduxjs/toolkit";

const uiInitialState = {
  isDark: true,
  isSidebarLong: false,
  showIntroUserPrompt: false,
};

const uiCreteSlice = createSlice({
  name: "uiSlice",
  initialState: uiInitialState,
  reducers: {
    toggleSideBar(state) {
      state.isSidebarLong = !state.isSidebarLong;
    },
    toggleTheme(state) {
      state.isDark = !state.isDark;
      const theme = state.isDark ? "dark" : "light";
      localStorage.setItem("theme", theme);
    },
    userIntroPromptHandler(state, action) {
      state.showIntroUserPrompt = action.payload.introPrompt;
    },
  },
});

export const uiAction = uiCreteSlice.actions;

export default uiCreteSlice.reducer;
