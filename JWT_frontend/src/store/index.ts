// Импортируем необходимые функции и типы из Redux Toolkit и React Redux.
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import { useDispatch } from 'react-redux';

// Импортируем middleware для логирования действий и состояния.
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  // Настройка middleware для нашего store.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      // Добавляем middleware для логирования, если окружение не production.
      ...(process.env.NODE_ENV !== 'production' ? [logger] : []),
    ),
});

// Определяем типы для удобства работы с состоянием и dispatch в наших компонентах.
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
