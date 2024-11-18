import "./App.css";
import ChatSection from "./components/ChatSection/ChatSection";
import Sidebar from "./components/Sidebar/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { uiAction } from "./store/ui-gemini";
import { useEffect } from "react";
import { getRecentChat } from "./store/chat-action";

function App() {
  const dispatch = useDispatch();
  const newChat = useSelector((state) => state.chat.newChat);
  const isDark = useSelector((state) => state.ui.isDark);

  useEffect(() => {
    const getLocalTheme = localStorage.getItem("theme");
    const theme = getLocalTheme || "dark";
    document.documentElement.setAttribute("data-theme", theme);
  }, [isDark]);

  useEffect(() => {
    if (newChat === false) {
      dispatch(getRecentChat());
    }
  }, [dispatch, newChat]);

  useEffect(() => {
    const showUserPrompt = setInterval(() => {
      const isShowIntroAlready = localStorage.getItem("isIntroShow") || false;
      if (!isShowIntroAlready) {
        dispatch(uiAction.userIntroPromptHandler({ introPrompt: true }));
        localStorage.setItem("isIntroShow", true);
      }
    }, 2 * 1000);

    return () => clearInterval(showUserPrompt);
  }, [dispatch]);

  return (
    <div className="App">
      <Sidebar />
      <ChatSection />
    </div>
  );
}

export default App;
