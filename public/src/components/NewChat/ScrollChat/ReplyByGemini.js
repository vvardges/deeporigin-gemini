import DOMPurify from "dompurify";
import React, { useState, useEffect } from "react";
import "./ScrollChatModule.css";
import CopyBtn from "../../Ui/CopyBtn";
import StopBtn from "../../Ui/StopBtn";
import {stopSendData} from "../../../store/chat-action";

let intervalId;

const ReplyByGemini = (props) => {
  const [currentIndex, setCurrentIndex] = useState(
      props.shouldAnimate ? 0 : props?.gemini?.length
  );
  const [showCopyBtn, setShowCopyBtn] = useState(currentIndex === props?.gemini?.length);

  useEffect(() => {
    intervalId = setInterval(() => {
      if (currentIndex < props?.gemini?.length) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setShowCopyBtn(true);
      }
    }, 5);

    return () => clearInterval(intervalId);
  }, [props?.gemini, currentIndex]);

  const handleStopClick = () => {
      clearInterval(intervalId);
      stopSendData();
      setShowCopyBtn(true);
  }

  return (
      <>
        <p
            className="gemini-p"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(props?.gemini?.slice(0, currentIndex)),
            }}
        ></p>
        {props.isReady && showCopyBtn ?
            <CopyBtn data={props.gemini}/> :
            <StopBtn onClick={handleStopClick}>stop</StopBtn>
        }
      </>
  );
};

export default ReplyByGemini;
