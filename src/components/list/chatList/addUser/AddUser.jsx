import React, { useState } from "react";
import "./addUser.css";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  setDoc,
  serverTimestamp,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";
import { useSelector } from "react-redux";

const AddUser = ({ setAddMode }) => {
  const [mode, setMode] = useState(false);
  const [user, setUser] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");

    const q = query(collection(db, "users"), where("username", "==", username));
    try {
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        setUser(querySnapshot.docs[0].data());
      }
    } catch (error) {
      console.log(error.message);
    }
    console.log(user);
  };
  const handleAdd = async () => {
    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userChats");
    console.log(chatRef);

    try {
      const newChatRef = doc(db, "chats", user.id);
      await setDoc(newChatRef, {
        createAt: serverTimestamp(),
        messages: [],
      });
      await updateDoc(doc(userChatRef, user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: null,
          receiverId: currentUser.user.id,
          updatedAt: Date.now(),
        }),
      });
      await updateDoc(doc(userChatRef, currentUser.user.id), {
        chats: arrayUnion({
          chatId: newChatRef.id,
          lastMessage: null,
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
      setAddMode(false);
      console.log(newChatRef.id);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" name="username" placeholder="username" />
        <button type="submit">Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="details">
            <img src={user.avatar || "/public/avatar.png"} alt="profile" />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
      <hr />
    </div>
  );
};

export default AddUser;
