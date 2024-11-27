import React, { useState } from "react";
import "./login.css";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../slices/userSlice";
const Login = () => {
  const [showAvatar, setShowAvatar] = useState({
    file: null,
    url: "",
  });

  const dispatch = useDispatch();
  const { currentUser, loading } = useSelector((state) => state.user);

  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setShowAvatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    const imageUrl = await upload(showAvatar.file);
    const newUser = {
      username: username,
      email: email,
      password: password,
      imageUrl: imageUrl,
    };

    dispatch(registerUser(newUser));
  };

  const handleLogin = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const { email, password } = Object.fromEntries(formData);
    const user = {
      email,
      password,
    };
    dispatch(loginUser(user));
  };
  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="email" name="email" />
          <input type="password" placeholder="password" name="password" />
          <button disabled={loading} type="submit">
            {loading ? "Loading" : "Sign In"}
          </button>
        </form>
      </div>
      <div className="separator"></div>
      <div className="item">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={showAvatar.url || "/public/avatar.png"} alt="profile" />
            Upload an image
          </label>
          <input
            type="file"
            id="file"
            style={{ display: "none" }}
            onChange={handleAvatar}
          />
          <input type="text" placeholder="username" name="username" />
          <input type="email" placeholder="email" name="email" />
          <input type="password" placeholder="password" name="password" />
          <button disabled={loading} type="submit">
            {loading ? "Loading" : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
