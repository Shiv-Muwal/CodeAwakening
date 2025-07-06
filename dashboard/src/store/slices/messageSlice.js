import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    loading: false,
    messages: [],
    error: null,
    message: null,
  },
  reducers: {
    getAllMessagesRequest(state, action) {
      state.messages = [];
      state.error = null;
      state.loading = true;
    },
    getAllMessagesSuccess(state, action) {
      state.messages = action.payload;
      state.error = null;
      state.loading = false;
    },
    getAllMessagesFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    deleteMessageRequest(state, action) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteMessageSuccess(state, action) {
      state.error = null;
      state.loading = false;
      state.message = action.payload;
    },
    deleteMessageFailed(state, action) {
      state.error = action.payload;
      state.loading = false;
      state.message = null;
    },
    resetMessageSlice(state) {
      state.error = null;
      state.message = null;
      state.loading = false;
    },
    clearAllErrors(state) {
      state.error = null;
    },
  },
});


export const getAllMessages = () => async (dispatch) => {
  dispatch(messageSlice.actions.getAllMessagesRequest());
  try {
    const { data } = await axios.get("https://codeawakening.onrender.com/api/v1/message/getall", {
      withCredentials: true,
    });
    dispatch(messageSlice.actions.getAllMessagesSuccess(data.messages));
  } catch (error) {
    dispatch(
      messageSlice.actions.getAllMessagesFailed(
        error?.response?.data?.message || "Unauthorized"
      )
    );
  }
};
export const deleteMessage = (id) => async (dispatch) => {
  dispatch(messageSlice.actions.deleteMessageRequest());
  try {
    const { data } = await axios.delete(`https://codeawakening.onrender.com/api/v1/message/delete/${id}`, {
      withCredentials: true,
    });
    dispatch(messageSlice.actions.deleteMessageSuccess(data.message));
  } catch (error) {
    dispatch(
      messageSlice.actions.deleteMessageFailed(
        error?.response?.data?.message || "Unauthorized"
      )
    );
  }
};

export const clearAllMessageErrors = () => (dispatch) => {
  dispatch(messageSlice.actions.clearAllErrors());
};

export const resetMessagesSlice = () => (dispatch) => {
  dispatch(messageSlice.actions.resetMessageSlice());
};
export default messageSlice.reducer;
