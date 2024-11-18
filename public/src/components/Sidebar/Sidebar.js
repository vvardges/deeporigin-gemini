import styles from "./Sidebar.module.css";
import { themeIcon } from "../../asset";
import { useSelector, useDispatch } from "react-redux";
import { uiAction } from "../../store/ui-gemini";
import { useEffect, useState } from "react";
import { chatAction } from "../../store/chat";
import { Link, useNavigate } from "react-router-dom";
import ToggleButton from "../Ui/ToggleButton";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSidebarLong = useSelector((state) => state.ui.isSidebarLong);
  const [showItemsWithDelay, setShowItemsWithDelay] = useState(isSidebarLong);
  const isNewChat = useSelector((state) => state.chat.newChat);
  const recentChat = useSelector((state) => state.chat.recentChat);
  const [isShowMore, setisShowMore] = useState(false);
  const [isActiveChat, setIsActiveChat] = useState("");
  const chatHistoryId = useSelector((state) => state.chat.chatHistoryId);
  const themeMode = useSelector((state) => state.ui.isDark);
  const getLocalTheme = localStorage.getItem("theme");
  const theme = getLocalTheme || "dark";

  const sideBarWidthHandler = () => {
    dispatch(uiAction.toggleSideBar());
  };

  const showMoreHandler = () => {
    setisShowMore((pre) => !pre);
  };

  const themeHandler = () => {
    dispatch(uiAction.toggleTheme());
  };

  useEffect(() => {
    const id = chatHistoryId || "";
    setIsActiveChat(id);
  }, [chatHistoryId]);

  useEffect(() => {
    if(isSidebarLong) {
      setTimeout(() => setShowItemsWithDelay(true), 400);
    } else {
      setShowItemsWithDelay(false)
    }
  }, [isSidebarLong]);

  const newChatHandler = () => {
    dispatch(chatAction.replaceChat({ chats: [] }));
    dispatch(chatAction.newChatHandler());
    dispatch(chatAction.chatHistoryIdHandler({ chatHistoryId: "" }));
    navigate("/");
  };

  const icon = themeIcon();
  const sideBarWidthClass = isSidebarLong ? "side-bar-long" : "side-bar-sort";
  const showMoreArrowIcon = isShowMore ? icon.upArrowIcon : icon.expandIcon;

  return (
      <div className={`${styles["sidebar-main"]} ${styles[sideBarWidthClass]}`}>
        <div className={styles["menu-icon"]} onClick={sideBarWidthHandler}>
          <img src={icon.menuIcon} alt="menu icon"></img>
        </div>

        <div className={styles["recent-chat-section"]}>
          {isNewChat ? (
              <div
                  onClick={newChatHandler}
                  className={`${styles["pluc-icon"]} ${styles["new-plus-icon"]}`}
              >
                <img src={icon.plusIcon} alt="plus icon"></img>
                {isSidebarLong && <p>New chat</p>}
              </div>
          ) : (
              <div className={`${styles["pluc-icon"]} ${styles["old-plus-icon"]}`}>
                <img src={icon.plusIcon} alt="plus icon"></img>
                {isSidebarLong && <p>New chat</p>}
              </div>
          )}
          {isSidebarLong && (
              <div className={styles["recent-chat-main"]}>
                <p>Recent</p>

                {recentChat.slice(0, 5).map((chat) => (
                    <Link to={`/app/${chat._id}`} key={chat._id}>
                      <div
                          className={`${styles["recent-chat"]} ${
                              isActiveChat === chat._id
                                  ? styles["active-recent-chat"]
                                  : ""
                          }`}
                          onClick={() => {
                            setIsActiveChat(chat._id);
                          }}
                      >
                        <img src={icon.messageIcon} alt="message"></img>
                        <p>{chat.title.slice(0, 20)}</p>
                      </div>
                    </Link>
                ))}
                {isShowMore &&
                    recentChat.slice(5, recentChat.length).map((chat) => (
                        <Link to={`/app/${chat._id}`} key={chat._id}>
                          <div
                              className={`${styles["recent-chat"]} ${
                                  isActiveChat === chat._id
                                      ? styles["active-recent-chat"]
                                      : ""
                              }`}
                              onClick={() => {
                                setIsActiveChat(chat._id);
                              }}
                              key={chat._id}
                          >
                            <img src={icon.messageIcon} alt="message"></img>
                            <p>{chat.title.slice(0, 20)}</p>
                          </div>
                        </Link>
                    ))
                }
                {recentChat.length > 5 && (
                    <div className={styles["show-more"]} onClick={showMoreHandler}>
                      <img src={showMoreArrowIcon} alt="drop down"></img>
                      <p>{isShowMore ? "Show less" : "Show more"}</p>
                    </div>
                )}
              </div>
          )}
        </div>

        <div className={styles["settings-section"]}>
          <div className={styles["theme"]} onClick={themeHandler}>
            <img src={icon.moonIcon} alt="moon icon"></img>
            {showItemsWithDelay && <>
              <p>Dark theme</p>
              <ToggleButton theme={theme} mode={themeMode}/>
            </>}
          </div>
        </div>
      </div>
  );
};

export default Sidebar;
