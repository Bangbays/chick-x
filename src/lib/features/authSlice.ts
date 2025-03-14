import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IUser {
  user: {
    name: string;
    username: string;
    email: string;
  } | null;
}

const initialState: IUser = {
  user: null,
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    onLogin: (state, action: PayloadAction<IUser["user"]>) => {
      state.user = action.payload;
    },
    onLogout: (state) => {
      state.user = null;
    },
  },
});

export const { onLogin, onLogout } = authSlice.actions;
export default authSlice.reducer;