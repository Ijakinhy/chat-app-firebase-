import React, { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { useDispatch, useSelector } from "react-redux";
import { db } from "../../../lib/firebase";
import { changeChat } from "../../../slices/chatSlice";
import { jwtDecode } from "jwt-decode";

const ChatList = () => {
  const [addMode, setAddMode] = useState(false);
  const [chats, setChats] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  const { chatId } = useSelector((state) => state.chat);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  let decodedToken;
  if (localStorage.token) {
    decodedToken = jwtDecode(localStorage.token);
  }
  useEffect(() => {
    const unSub = onSnapshot(
      doc(db, "userChats", decodedToken?.user_id),
      async (res) => {
        const items = res.data()?.chats || [];

        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();

          return {
            ...item,
            user,
          };
        });

        const chatData = await Promise.all(promises);
        // console.log(chatData);
        const sortedData = chatData.sort((a, b) => b.updatedAt - a.updatedAt);

        setChats(sortedData);
      }
    );

    return () => {
      unSub();
    };
  }, [currentUser.user.id]);

  console.log(chats);

  const handleSelectChat = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      console.log(rest);

      return rest;
    });
    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );
    userChats[chatIndex].isSeen = true;
    try {
      await updateDoc(doc(db, "userChats", currentUser.user.id), {
        chats: userChats,
      });
      dispatch(
        changeChat({
          chatId: chat.chatId,
          user: chat.user,
          currentUser: currentUser.user,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  const filteredChats = chats.filter((chat) =>
    chat.user.username.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="chatList">
      <div className="search">
        <div className="searchBar">
          <img src="/public/search.png" alt="search" />
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <img
          src={addMode ? "/public/minus.png" : "/public/plus.png"}
          alt="profile"
          onClick={() => setAddMode(!addMode)}
          className="add"
        />
      </div>

      {filteredChats.map((chat) => {
        return (
          <div
            className="item"
            key={chat?.chatId}
            onClick={() => handleSelectChat(chat)}
            style={{
              backgroundColor:
                chat.isSeen || !chat.lastMessage ? "transparent" : "#5183fe",
            }}
          >
            <img
              src={
                chat.user.blocked.includes(currentUser.user.id)
                  ? "/public/avatar.png"
                  : chat.user.avatar
              }
              alt=""
            />
            <div className="texts">
              <span>
                {chat.user.blocked.includes(currentUser.user.id)
                  ? "user"
                  : chat.user.username}
              </span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        );
      })}

      {addMode && <AddUser setAddMode={setAddMode} />}
    </div>
  );
};

export default ChatList;
