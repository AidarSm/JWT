import { Dispatch } from '@reduxjs/toolkit';
import api from '../../api';
import { ILoginRequest, ILoginResponse } from '../../api/auth/types';
import {
  loginStart,
  loginSuccess,
  loginFailure,
  logoutSuccess,
  loadProfileStart,
  loadProfileFailure,
  loadProfileSuccess,
} from './authSlice';

import { store } from '..';
// Импортируем тип AxiosPromise из библиотеки axios.
import { AxiosPromise } from 'axios';
// Импортируем утилиту для проверки истечения срока действия токена.
import { isTokenExpired } from '../../utils/jwt';

// Асинхронное действие для входа пользователя.
export const loginUser =
  (data: ILoginRequest) =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    try {
      dispatch(loginStart());

      // Выполняем запрос на вход с данными пользователя.
      const res = await api.auth.login(data);

      // Диспатчим успешное действие с полученным токеном доступа.
      dispatch(loginSuccess(res.data.accessToken));
      // Диспатчим действие для загрузки профиля пользователя.
      dispatch(getProfile());
    } catch (e: any) {
      console.error(e);
      // В случае ошибки диспатчим действие с сообщением об ошибке.
      dispatch(loginFailure(e.message));
    }
  };

// Асинхронное действие для выхода пользователя.
export const logoutUser =
  () =>
  async (dispatch: Dispatch): Promise<void> => {
    try {
      // Выполняем запрос на выход.
      await api.auth.logout();

      // Диспатчим успешное действие для завершения сеанса пользователя.
      dispatch(logoutSuccess());
    } catch (e) {
      console.error(e);
    }
  };

// Асинхронное действие для получения профиля пользователя.
export const getProfile =
  () =>
  async (dispatch: Dispatch<any>): Promise<void> => {
    try {
      // Диспатчим действие для начала загрузки профиля.
      dispatch(loadProfileStart());

      // Выполняем запрос на получение профиля пользователя.
      const res = await api.auth.getProfile();

      // Диспатчим успешное действие с данными профиля.
      dispatch(loadProfileSuccess(res.data));
    } catch (e: any) {
      console.error(e);
      // В случае ошибки диспатчим действие с сообщением об ошибке.
      dispatch(loadProfileFailure(e.message));
    }
  };

// Переменная для хранения запроса обновления токена (для избежания race condition).
let refreshTokenRequest: AxiosPromise<ILoginResponse> | null = null;

// Асинхронное действие для получения токена доступа.
export const getAccessToken =
  () =>
  async (dispatch: Dispatch<any>): Promise<string | null> => {
    try {
      // Получаем текущий токен доступа из состояния.
      const accessToken = store.getState().auth.authData.accessToken;

      // Проверяем, существует ли токен и не истек ли его срок действия.
      if (!accessToken || isTokenExpired(accessToken)) {
        // Если токен необходимо обновить и запрос на обновление еще не был сделан, выполняем его.
        if (refreshTokenRequest === null) {
          refreshTokenRequest = api.auth.refreshToken();
        }

        // Ждем выполнения запроса на обновление токена.
        const res = await refreshTokenRequest;
        // Сбрасываем переменную запроса обновления токена.
        refreshTokenRequest = null;

        // Диспатчим успешное действие с новым токеном доступа.
        dispatch(loginSuccess(res.data.accessToken));

        return res.data.accessToken;
      }

      // Если токен валиден, возвращаем его.
      return accessToken;
    } catch (e) {
      console.error(e);

      return null;
    }
  };