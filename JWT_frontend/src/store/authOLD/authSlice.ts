// Импортируем необходимые функции из Redux Toolkit для создания слайса.
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  authData: {
    accessToken: string | null;
    isLoading: boolean;
    error: string | null;
  };
  profileData: {
    profile: string | null;
    isLoading: boolean;
    error: string | null;
  };
}

const initialState: AuthState = {
  authData: {
    accessToken: null,
    isLoading: false,
    error: null,
  },
  profileData: {
    profile: null,
    isLoading: false,
    error: null,
  },
};

export const authReducer = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.authData.isLoading = true; // Устанавливаем флаг загрузки в true, указывая, что происходит аутентификация.
    },
    loginSuccess: (state, action: PayloadAction<string>) => {
      state.authData.accessToken = action.payload; // Сохраняем токен доступа, переданный через действие.
      state.authData.isLoading = false; // Сбрасываем флаг загрузки в false, указывая, что аутентификация завершена.
      state.authData.error = null; // Очищаем любые возможные ошибки.
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.authData.isLoading = false; // Сбрасываем флаг загрузки в false.
      state.authData.error = action.payload; // Сохраняем сообщение об ошибке, переданное через действие.
    },
    loadProfileStart: (state) => {
      state.profileData.isLoading = true; // Устанавливаем флаг загрузки в true.
    },
    loadProfileSuccess: (state, action: PayloadAction<string>) => {
      state.profileData.profile = action.payload; // Сохраняем данные профиля, переданные через действие.
      state.profileData.isLoading = false; // Сбрасываем флаг загрузки в false.
      state.profileData.error = null; // Очищаем любые возможные ошибки.
    },
    loadProfileFailure: (state, action: PayloadAction<string>) => {
      state.profileData.isLoading = false; // Сбрасываем флаг загрузки в false.
      state.profileData.error = action.payload; // Сохраняем сообщение об ошибке, переданное через действие.
    },
    logoutSuccess: () => initialState,
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  loadProfileStart,
  loadProfileSuccess,
  loadProfileFailure,
  logoutSuccess,
} = authReducer.actions;

export default authReducer.reducer;
