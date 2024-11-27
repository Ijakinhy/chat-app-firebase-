import { useContext, useEffect } from "react";
import Chat from "./components/chats/Chats";
import Details from "./components/details/Details";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "./slices/userSlice";
import { Route, Router, Routes } from "react-router-dom";
import PrivateRoutes from "./lib/PrivateRoutes";
import { jwtDecode } from "jwt-decode";

function App() {
  // const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const dispatch = useDispatch();
  const { currentUser, isLoading } = useSelector((state) => state.user);
  const { chatId } = useSelector((state) => state.chat);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, (user) => {
      // console.log(user);
      dispatch(fetchUserInfo(user?.uid));
    });

    return () => {
      unSub();
    };
  }, []);
  if (isLoading) return <div className="loading">Loading...</div>;
  return (
    <div className="container">
      {currentUser.user ? (
        <>
          {<List />}
          {chatId && <Chat />}
          {chatId && <Details />}
        </>
      ) : (
        <Login />
      )}

      <Notification />
    </div>
  );
}

export default App;
