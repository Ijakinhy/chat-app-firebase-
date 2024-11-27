import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";

import "./chats.css";
import EmojiPicker from "emoji-picker-react";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useSelector } from "react-redux";
import upload from "../../lib/upload";

const Chats = () => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const [chat, setChat] = useState(null);
  const [text, setText] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const endRef = useRef();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useSelector(
    (state) => state.chat
  );
  const { currentUser } = useSelector((state) => state.user);
  const handleEmojiClick = (event) => {
    setText((prev) => prev + event.emoji);
    setTimeout(() => {
      setOpenEmoji(false);
    }, 1000);
  };
  useEffect(() => endRef.current.scrollIntoView({ behavior: "smooth" }), []);
  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChat(res.data());
    });
    return () => {
      unSub();
    };
  }, [chatId]);

  const handleImg = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleSendMessage = async () => {
    if (text === "" && !chat.lastMessage) return;
    let imgURL = null;
    try {
      if (img.file) {
        imgURL = await upload(img.file);
      }

      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          createdAt: new Date(),
          text: text,
          senderId: currentUser.user.id,

          ...(imgURL && { img: imgURL }),
        }),
      });
      const userIDs = [user.id, currentUser.id];
      userIDs.forEach(async (id) => {
        const userChatsRef = doc(db, "userChats", id);
        const userChatsSnapShot = await getDoc(userChatsRef);

        if (userChatsSnapShot.exists()) {
          const userChatsData = userChatsSnapShot.data();

          const chatIndex = userChatsData.chats.findIndex(
            (item) => item.chatId === chatId
          );
          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.user.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();

          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });

      setImg({
        file: null,
        url: "",
      });
      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="chats">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "/public/avatar.png"} alt="" />
          <div className="texts">
            <span>{user?.username}</span>
            <p>Lorem ipsum, dolor sit amet </p>
          </div>
        </div>
        <div className="icons">
          <img src="/public/phone.png" alt="icon" />
          <img src="/public/video.png" alt="icon" />
          <img src="/public/info.png" alt="icon" />
        </div>
      </div>
      <div className="center">
        {chat?.messages?.map((message) => (
          <div
            className={
              message.senderId === currentUser.user.id
                ? "message own "
                : "message"
            }
            key={message?.createdAt}
          >
            <div className="texts">
              {message.img && <img src={message.img} alt="message image " />}
              <p>{message?.text}</p>
              <span>1 min ago</span>
            </div>
          </div>
        ))}

        {img.url && (
          <div className="message own">
            <div className="texts">
              <img src={img.url} alt="send img" />
            </div>
          </div>
        )}
        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleImg}
            disabled={isCurrentUserBlocked || isReceiverBlocked}
          />
          <label htmlFor="file">
            <img src="/public/camera.png" alt="" />
          </label>

          <img src="/public/mic.png" alt="" />
        </div>
        <input
          value={text}
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You cannot send a message"
              : "Type a message..."
          }
          onChange={(e) => setText(e.target.value)}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        />
        <div className="emoji">
          <img
            src="/public/emoji.png"
            alt=""
            onClick={() => setOpenEmoji(!openEmoji)}
          />
          <div className="picker">
            <EmojiPicker onEmojiClick={handleEmojiClick} open={openEmoji} />
          </div>
        </div>
        <button
          className="sendButton"
          onClick={handleSendMessage}
          disabled={isCurrentUserBlocked || isReceiverBlocked}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chats;
