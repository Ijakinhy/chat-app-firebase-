import React from "react";
import "./details.css";
import { auth, db } from "../../lib/firebase";
import { useDispatch, useSelector } from "react-redux";
import { blockUser } from "../../slices/chatSlice";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";
import { fetchUserInfo } from "../../slices/userSlice";
import { jwtDecode } from "jwt-decode";

const Details = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = useSelector(
    (state) => state.chat
  );
  const decodedToken = jwtDecode(localStorage.token);

  const handleBlockUser = async () => {
    if (!user) return;
    const userDocRef = doc(db, "users", currentUser.user.id);
    try {
      updateDoc(userDocRef, {
        blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id),
      });
      console.log(decodedToken);

      dispatch(blockUser());
      dispatch(fetchUserInfo(decodedToken.user_id));
    } catch (error) {
      console.log(error.message);
    }
    console.log("user blocked");
  };

  return (
    <div className="details">
      <div className="user">
        <img src={user?.avatar || "/public/avatar.png"} alt="" />
        <h2>{user?.username}</h2>
        <p>Lorem ipsum dolor sit amet </p>
      </div>
      <div className="info">
        <div className="option">
          <div className="title">
            <span>Chat Setting</span>
            <img src="/public/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Privacy & Help</span>
            <img src="/public/arrowUp.png" alt="" />
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared Photos</span>
            <img src="/public/arrowUp.png" alt="" />
          </div>
          <div className="photos">
            <div className="photoItem">
              <div className="photoDetails">
                <img
                  src="https://i.pinimg.com/564x/ce/20/60/ce2060314b4daef70babb66dbb29cfa6.jpg"
                  alt=""
                />
                <span>photo_2020_pro</span>
              </div>
              <img src="/public/download.png" className="icon" alt="" />
            </div>

            <div className="photoItem">
              <div className="photoDetails">
                <img
                  src="https://i.pinimg.com/564x/ce/20/60/ce2060314b4daef70babb66dbb29cfa6.jpg"
                  alt=""
                />
                <span>photo_2020_pro</span>
              </div>
              <img src="/public/download.png" className="icon" alt="" />
            </div>
            <div className="photoItem">
              <div className="photoDetails">
                <img
                  src="https://i.pinimg.com/564x/ce/20/60/ce2060314b4daef70babb66dbb29cfa6.jpg"
                  alt=""
                />
                <span>photo_2020_pro</span>
              </div>
              <img src="/public/download.png" className="icon" alt="" />
            </div>
            <div className="photoItem">
              <div className="photoDetails">
                <img
                  src="https://i.pinimg.com/564x/ce/20/60/ce2060314b4daef70babb66dbb29cfa6.jpg"
                  alt=""
                />
                <span>photo_2020_pro</span>
              </div>
              <img src="/public/download.png" className="icon" alt="" />
            </div>
          </div>
        </div>
        <div className="option">
          <div className="title">
            <span>Shared files</span>
            <img src="/public/arrowDown.png" alt="" />
          </div>
        </div>
        <button onClick={handleBlockUser}>
          {isCurrentUserBlocked
            ? "You're Blocked!"
            : isReceiverBlocked
            ? "User Blocked!"
            : "Block User"}
        </button>
        <button className="logout" onClick={() => auth.signOut()}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Details;
