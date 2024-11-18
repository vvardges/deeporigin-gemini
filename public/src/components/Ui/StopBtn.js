import styles from "./CopyBtn.module.css";
import { themeIcon } from "../../asset";

const StopBtn = ({onClick}) => {
  const icon = themeIcon();
  return (
      <div onClick={onClick} className={`${styles["stop-icon"]}`}>
        <img src={icon.stopIcon} alt="stop icon" />
      </div>
  );
};

export default StopBtn;
