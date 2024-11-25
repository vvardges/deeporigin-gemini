import { chatAction } from "./chat";

const SERVER_ENDPOINT = process.env.REACT_APP_SERVER_ENDPOINT;

export const getRecentChat = () => {
  return (dispatch) => {
    const url = `${SERVER_ENDPOINT}/gemini/api/getchathistory`;

    fetch(url, {
      method: "GET",
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("server error");
        }

        return response.json();
      })
      .then((data) => {
        dispatch(
          chatAction.recentChatHandler({ recentChat: data.chatHistory })
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };
};

let controller;

export const stopSendData = () => {
  controller.abort();
}

export const sendChatData = (useInput) => {
  controller = new AbortController();
  return (dispatch) => {
    dispatch(chatAction.chatStart({ useInput: useInput }));

    const apiKey = process.env.REACT_APP_GEMINI_KEY;

    const url = `${SERVER_ENDPOINT}/gemini/api/chat`;

    fetch(url, {
      signal: controller.signal,
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
      body: JSON.stringify({
        userInput: useInput.user,
        previousChat: useInput.previousChat,
        chatHistoryId: useInput.chatHistoryId,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          const statusCode = response.status;
          const error = new Error(`Server Error: ${statusCode}`);
          error.statusCode = statusCode;
          throw error;
        }

        return response.json();
      })
      .then((data) => {
        dispatch(
          chatAction.previousChatHandler({
            previousChat: [
              { role: "user", parts: data.user },
              { role: "model", parts: data.gemini },
            ],
          })
        );
        dispatch(chatAction.popChat());
        dispatch(
          chatAction.chatStart({
            useInput: {
              user: data.user,
              gemini: data.gemini,
              isLoader: "no",
            },
          })
        );
        if (useInput.chatHistoryId.length < 2) {
          dispatch(getRecentChat());
        }
        dispatch(chatAction.newChatHandler());
        dispatch(
          chatAction.chatHistoryIdHandler({ chatHistoryId: data.chatHistoryId })
        );
      })
      .catch((err) => {
        const statusCode = err.statusCode || 500;

        dispatch(chatAction.popChat());
        if (statusCode === 429) {
          dispatch(
            chatAction.chatStart({
              useInput: {
                user: useInput.user,
                gemini:
                  "Rate Limit Exceeded. Please wait for one hour before trying again. Thank you for your patience.",
                isLoader: "no",
              },
            })
          );
        } else {
          dispatch(
            chatAction.chatStart({
              useInput: {
                user: useInput.user,
                gemini:
                  "Oops, something went wrong. Please try again.",
                isLoader: "no",
              },
            })
          );
        }
        dispatch(chatAction.newChatHandler());
      });
  };
};

export const getChat = (chatHistoryId) => {
  return (dispatch) => {
    dispatch(chatAction.loaderHandler());
    const url = `${SERVER_ENDPOINT}/gemini/api/chatdata`;

    fetch(url, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ chatHistoryId }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("server error");
        }
        return response.json();
      })
      .then((data) => {
        dispatch(chatAction.loaderHandler());
        const previousChat = data.chats.flatMap((c) => [
          { role: "user", parts: c.message.user },
          { role: "model", parts: c.message.gemini },
        ]);

        const chats = data.chats.map((c) => {
          return {
            user: c.message.user,
            gemini: c.message.gemini,
            id: c._id,
            isLoader: "no",
          };
        });

        const chatHistoryId = data.chatHistory;

        dispatch(chatAction.replacePreviousChat({ previousChat }));
        dispatch(chatAction.replaceChat({ chats }));
        dispatch(chatAction.chatHistoryIdHandler({ chatHistoryId }));
        dispatch(chatAction.newChatHandler());
      })
      .catch((err) => {
        console.log(err);
        dispatch(
          chatAction.replaceChat({
            chats: [
              {
                error: true,
                user: "Hi, is there any issue ? ",
                gemini: "",
                id: 0,
                isLoader: "Oops! I cound't find you chat history",
              },
            ],
          })
        );
        dispatch(chatAction.loaderHandler());
        dispatch(chatAction.chatHistoryIdHandler({ chatHistoryId }));
      });
  };
};
