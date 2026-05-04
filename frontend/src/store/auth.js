import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
  name: "auth",
  initialState: { isLoggedIn: false, role: localStorage.getItem("role") || "" },
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.role = action.payload?.role || localStorage.getItem("role") || "";
    },
    logout(state) {
      state.isLoggedIn = false;
      state.role = "";
    },
  },
});

export const authAction = authSlice.actions;
export default authSlice.reducer;
