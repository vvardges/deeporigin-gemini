import styles from "./PromptSection.module.css";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { chatAction } from "../../../store/chat";

const suggestPrompt = [
  "What are the known chemical properties of Aspirin? Give them in a table.",
  "Can you give me chemical equation of Ferum's oxidation?",
  "Give me the list of proteins available in human heart.",
  "Give me the smiles of Aspirin."
];

const PromptSection = () => {
  const dispatch = useDispatch();
  const [randPrompt, setRandPrompt] = useState([]);

  useEffect(() => {
    const getRandomPrompts = (list) => {
      const promptsCopy = [...list];
      promptsCopy.sort(() => Math.random() - 0.5);
      return promptsCopy.slice(0, 4);
    };
    const randomSuggestions = getRandomPrompts(suggestPrompt);
    setRandPrompt(randomSuggestions);
  }, []);

  const promptOnClick = (mainText) => {
    dispatch(chatAction.suggestPromptHandler({ prompt: mainText }));
  };
  return (
    <div className={styles["prompt-main"]}>
      {randPrompt.map((p, index) => (
        <div
          className={styles["prompt"]}
          key={index}
          onClick={() => promptOnClick(p)}
        >
          <p>{p}</p>
        </div>
      ))}
    </div>
  );
};

export default PromptSection;
