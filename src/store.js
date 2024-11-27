import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../src/slices/userSlice";
import chatSlice from "./slices/chatSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    chat: chatSlice,
  },
});
