import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { ILoginRequest } from '../../api/auth/types';
import { isTokenExpired } from '../../utils/jwt';
import { RootState } from '../index';

// Асинхронное действие для входа пользователя
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: ILoginRequest, { rejectWithValue }) => {
    try {
      const response = await api.auth.login(data);
      return response.data.accessToken;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

// Асинхронное действие для выхода пользователя
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await api.auth.logout();
});

// Асинхронное действие для получения профиля пользователя
export const getProfile = createAsyncThunk('auth/getProfile', async (_, { rejectWithValue }) => {
  try {
    const response = await api.auth.getProfile();
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

// Асинхронное действие для получения токена доступа
export const getAccessToken = createAsyncThunk<string | null, void, { state: RootState }>(
  'auth/getAccessToken',
  async (_, { getState, dispatch, rejectWithValue }) => {
    const accessToken = getState().auth.authData.accessToken;

    if (!accessToken || isTokenExpired(accessToken)) {
      try {
        const refreshTokenRequest = api.auth.refreshToken();
        const response = await refreshTokenRequest;
        dispatch({ type: loginUser.fulfilled.type, payload: response.data.accessToken });
        return response.data.accessToken;
      } catch (error: any) {
        return rejectWithValue(error.message);
      }
    }

    return accessToken;
  },
);
