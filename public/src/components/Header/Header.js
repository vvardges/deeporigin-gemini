import styles from "./Header.module.css";
import { useDispatch, useSelector } from "react-redux";
import { uiAction } from "../../store/ui-gemini";
import { themeIcon } from "../../asset";
import { useNavigate } from "react-router-dom";
import { chatAction } from "../../store/chat";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNewChat = useSelector((state) => state.chat.newChat);

  const toggleSideBarHandler = () => {
    dispatch(uiAction.toggleSideBar());
  };

  const icon = themeIcon();

  const newChatHandler = () => {
    dispatch(chatAction.replaceChat({ chats: [] }));
    dispatch(chatAction.newChatHandler());
    dispatch(chatAction.chatHistoryIdHandler({ chatHistoryId: "" }));
    navigate("/");
  };

  return (
    <div className={styles["header-main"]}>
      <div className={styles["left-section"]}>
        <div className={styles["menu-icon"]} onClick={toggleSideBarHandler}>
          <img src={icon.menuIcon} alt="menu icon"></img>
        </div>
      </div>
      <div className={styles["right-section"]}>
        {isNewChat ? (
          <div
            onClick={newChatHandler}
            className={`${styles["plus-icon"]} ${styles["new-plus-icon"]}`}
          >
            <img src={icon.plusIcon} alt="plus icon"></img>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Header;
