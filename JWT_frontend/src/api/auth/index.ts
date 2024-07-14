// Импортируем тип AxiosPromise из библиотеки axios, который будет использоваться для типа возвращаемого значения наших функций.
import { AxiosPromise } from "axios";
// Импортируем константы, которые содержат URL-адреса конечных точек API.
import Endpoints from "../endpoints";
// Импортируем экземпляр axios, предварительно настроенный с базовым URL и другими настройками.
import { axiosInstance } from "../instance";
// Импортируем типы для запроса входа и ответа на него.
import { ILoginResponse, ILoginRequest } from "./types";

// Экспортируем функцию login, которая принимает параметры входа и отправляет POST-запрос к конечной точке AUTH.LOGIN.
export const login = (params: ILoginRequest): AxiosPromise<ILoginResponse> =>
  axiosInstance.post(Endpoints.AUTH.LOGIN, params);

// Экспортируем функцию refreshToken, которая отправляет GET-запрос к конечной точке AUTH.REFRESH для обновления токена.
export const refreshToken = (): AxiosPromise<ILoginResponse> => axiosInstance.get(Endpoints.AUTH.REFRESH);

// Экспортируем функцию logout, которая отправляет GET-запрос к конечной точке AUTH.LOGOUT для выхода из системы.
export const logout = (): AxiosPromise => axiosInstance.get(Endpoints.AUTH.LOGOUT);

// Экспортируем функцию getProfile, которая отправляет GET-запрос к конечной точке AUTH.PROFILE для получения информации о профиле текущего пользователя.
export const getProfile = (): AxiosPromise<string> => axiosInstance.get(Endpoints.AUTH.PROFILE);