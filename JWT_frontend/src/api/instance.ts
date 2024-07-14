// Импортируем axios и тип AxiosError для обработки ошибок.
import axios, { AxiosError } from 'axios';
// Импортируем хранилище состояния приложения и действие для получения токена доступа и выхода из системы.
import { store } from '../store';
import { getAccessToken, logoutUser } from '../store/auth/authThunk';
// Импортируем константы с URL-адресами конечных точек API.
import Endpoints from './endpoints';

// Создаем экземпляр axios с пустыми настройками.
export const axiosInstance = axios.create({ baseURL: process.env.REACT_APP_API_BASE_URL });

// Определяем массив URL-адресов, для которых не требуется аутентификация.
const urlsSkipAuth = [Endpoints.AUTH.LOGIN, Endpoints.AUTH.REFRESH, Endpoints.AUTH.LOGOUT];

// Добавляем промежуточное ПО (interceptor) для запросов, чтобы добавить заголовок авторизации, если необходимо.
axiosInstance.interceptors.request.use(async (config) => {
  // Если URL запроса не требует аутентификации, возвращаем его без изменений.
  if (config.url && urlsSkipAuth.includes(config.url)) {
    return config;
  }

  // Получаем токен доступа из хранилища.
  const accessToken = await store.dispatch(getAccessToken());

  // Если токен доступа существует, добавляем его в заголовки запроса.
  if (accessToken) {
    const authorization = `Bearer ${accessToken}`;

    config.headers = {
      ...config.headers,
      authorization: authorization,
    };
  }

  // Возвращаем модифицированный конфигурационный объект запроса.
  return config;
});

// Добавляем промежуточное ПО (interceptor) для ответов, чтобы обрабатывать ошибки аутентификации.
axiosInstance.interceptors.response.use(
  // Просто возвращаем ответ, если он успешен.
  (response) => response,
  // Обрабатываем ошибки.
  (error: AxiosError) => {
    // Проверяем, авторизован ли пользователь.
    const isLoggedIn = !!store.getState().auth.authData.accessToken;

    // Если произошла ошибка 401 (неправильная авторизация), пользователь авторизован, но не пытается выйти, и URL не является конечной точкой выхода, вызываем действие для выхода из системы.
    if (
      error.response?.status === 401 &&
      isLoggedIn &&
      error.request.url !== Endpoints.AUTH.LOGOUT
    ) {
      store.dispatch(logoutUser());
    }

    // Бросаем ошибку дальше по цепочке обработки.
    throw error;
  },
);
