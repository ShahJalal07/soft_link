import { createSlice } from "@reduxjs/toolkit";
export const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null,
    blur: false,
    model: false,
    groupdelete:[]
  },
  reducers: {
    userLoginInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    blurClassAdd: (state, action) => {
      state.blur = action.payload;
    },
    modelclass: (state, action) => {
      state.model = action.payload;
    },
    group: (state, action) => {
      state.group = action.payload;
    },
  },
});

export const { userLoginInfo, blurClassAdd, modelclass,group } = userSlice.actions;
export default userSlice.reducer;
