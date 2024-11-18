import { Route, Routes } from "react-router-dom";
import Header from "../Header/Header";
import InputSection from "../InputSection/InputSection";
import NewChat from "../NewChat/NewChat";
import styles from "./ChatSection.module.css";
import { useSelector } from "react-redux";
import ScrollChat from "../NewChat/ScrollChat/ScrollChat";
import Loader from "../Ui/Loader";

const ChatSection = () => {
  const isLoader = useSelector((state) => state.chat.isLoader);
  return (
    <div className={styles["chat-section-main"]}>
      <Header />
      {isLoader && <Loader />}
      <Routes>
        <Route path="/" element={<NewChat />}></Route>
        <Route path="/app" element={<ScrollChat />}></Route>
        <Route path="/app/:historyId" element={<ScrollChat />}></Route>
      </Routes>

      <InputSection />
    </div>
  );
};

export default ChatSection;
