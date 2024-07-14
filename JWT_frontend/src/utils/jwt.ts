// Импортируем функцию getUnixTime из модуля date для получения текущего времени в формате Unix.
import { getUnixTime } from './date';

// Определяем интерфейс IAuthTokenInfo для декодированной информации о токене.
export interface IAuthTokenInfo {
  exp: number; // Время истечения токена в секундах с начала эпохи Unix.
  iat: number; // Время выпуска токена в секундах с начала эпохи Unix.
  login: string; // Логин пользователя, связанный с токеном.
}

// Задаем константу LIFE_TIME_TO_UPDATE_MULTIPLIER для определения минимального времени жизни токена до обновления.
const LIFE_TIME_TO_UPDATE_MULTIPLIER = 0.5;

// Функция isTokenExpired проверяет, истек ли срок действия токена.
export const isTokenExpired = (token: string | null): boolean => {
  // Если токен отсутствует, считаем его истекшим.
  if (!token) {
    return true;
  }

  try {
    // Разделяем токен на части и берем вторую часть (payload), которая содержит полезную информацию.
    const tokenInfo = token.split('.')[1];

    // Декодируем payload токена, полученный в Base64, в строку.
    const tokenInfoDecoded = window.atob(tokenInfo);

    // Парсим декодированную строку в объект с информацией о токене.
    const { exp, iat }: IAuthTokenInfo = JSON.parse(tokenInfoDecoded);

    // Вычисляем оставшееся время до истечения срока действия токена.
    const tokenLifeTime = exp - getUnixTime();

    // Вычисляем минимальное время жизни токена до обновления, основываясь на разнице между временем истечения и временем выпуска токена.
    const minLifeTimeForUpdate = (exp - iat) * LIFE_TIME_TO_UPDATE_MULTIPLIER;

    // Возвращаем результат сравнения оставшегося времени токена с минимальным временем жизни до обновления.
    return tokenLifeTime < minLifeTimeForUpdate;
  } catch (e) {
    // В случае ошибки при декодировании или парсинге токена выводим ошибку в консоль и считаем токен истекшим.
    console.error(e);
    return true;
  }
};
