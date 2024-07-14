import { createSlice } from '@reduxjs/toolkit';
import { loginUser, logoutUser, getProfile, getAccessToken } from './authThunk';

interface AuthState {
  authData: {
    accessToken: string | null;
  };
  profileData: {
    profile: string | null;
  };
  loading: boolean;
  error: string | null | unknown;
}

const initialState: AuthState = {
  authData: {
    accessToken: null,
  },
  profileData: {
    profile: null,
  },
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Если у вас есть другие синхронные действия, добавьте их здесь
  },
  extraReducers: (builder) => {
    builder
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.authData.accessToken = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.authData.accessToken = null;
        state.profileData.profile = null;
      })
      // getProfile
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profileData.profile = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // getAccessToken
      .addCase(getAccessToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.authData.accessToken = action.payload;
      })
      .addCase(getAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
