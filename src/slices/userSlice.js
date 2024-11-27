import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import upload from "../lib/upload";

const initialState = {
  currentUser: {
    user: {},
    chats: [],
  },
  chats: [],
  loading: false,
};

export const registerUser = createAsyncThunk(
  "user/signUp",
  async (newUser, { rejectWithValue }) => {
    try {
      const { email, password, username, imageUrl } = newUser;

      const res = await createUserWithEmailAndPassword(auth, email, password);

      localStorage.setItem("token", res._tokenResponse.idToken);
      console.log(res);

      await setDoc(doc(db, "users", res.user.uid), {
        username: username,
        email: email,
        avatar: imageUrl,
        id: res.user.uid,
        blocked: [],
      });
      await setDoc(doc(db, "userChats", res.user.uid), {
        chats: [],
      });
      toast.success("Account  Created,yo u can login Now!");
      return newUser;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (formData, { rejectWithValue }) => {
    try {
      const userData = {};
      const { email, password } = formData;
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log(res._tokenResponse.localId);
      localStorage.setItem("token", res._tokenResponse.idToken);
      const userRef = doc(db, "users", res._tokenResponse.localId);
      const userSnap = await getDoc(userRef);
      userData.user = userSnap.exists() && userSnap.data();
      const chatsRef = doc(db, "userChats", res._tokenResponse.localId);
      const chatsSnap = await getDoc(chatsRef);
      userData.chats = chatsSnap.exists() && chatsSnap.data();

      toast.success("Login Success");
      return userData;
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);
export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // console.log("Document data:", docSnap.data());
        return docSnap.data();
      }
    } catch (error) {
      console.log(error.message);
    }
  }
);
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.currentUser = {
          user: action?.payload,
          chats: [],
        };
        state.loading = false;
      })
      .addCase(fetchUserInfo.rejected, (state) => {
        state.loading = false;
      })
      .addCase(registerUser.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        return {
          ...state,
          currentUser: {
            user: action?.payload,
            chats: [],
          },
          loading: false,
        };
      })
      .addCase(registerUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(loginUser.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log(action.payload);
        return {
          ...state,
          currentUser: {
            user: action?.payload.user,
            chats: action?.payload.chats,
          },
          loading: false,
        };
      })
      .addCase(loginUser.rejected, (state) => {
        state.loading = false;
      });
  },
});

export default userSlice.reducer;
export const selectCurrentUser = (state) => state.user;
