import { createSlice } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";

const initialState = {
  chatId: null,
  user: null,
  isCurrentUserBlocked: false,
  isReceiverBlocked: false,
};

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    changeChat: (state, action) => {
      const { chatId, user, currentUser } = action.payload;
      if (user.blocked.includes(currentUser.id)) {
        return { ...state, isCurrentUserBlocked: true, chatId };
      } else if (currentUser.blocked.includes(user.id)) {
        return {
          ...state,
          isReceiverBlocked: true,
          chatId: chatId,
          user: user,
        };
      } else {
        return { ...state, chatId, user: user };
      }
    },
    blockUser: (state) => {
      return { ...state, isReceiverBlocked: !state.isReceiverBlocked };
    },
  },
});

export const { changeChat, blockUser } = chatSlice.actions;
export default chatSlice.reducer;
