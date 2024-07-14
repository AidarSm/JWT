// Импортируем библиотеку jsonwebtoken для работы с JWT токенами
const jwt = require('jsonwebtoken');

// Определяем секретные ключи для подписи access и refresh токенов
const signatureAccess = 'MySuP3R_z3kr3t_access';
const signatureRefresh = 'MySuP3R_z3kr3t_refresh';

// Устанавливаем возраст access токена в 10 секунд и refresh токена в 1 час
const accessTokenAge = 10; //s
const refreshTokenTokenAge = 60 * 60; //s (1h)

// Middleware для проверки авторизации пользователя
const verifyAuthorizationMiddleware = (req, res, next) => {
  // Извлекаем токен из заголовка Authorization, если он присутствует
  const token = req.headers.authorization ? req.headers.authorization.split(' ')[1] : '';

  // Если токен отсутствует, отправляем ответ с кодом 401 Unauthorized
  if (!token) {
    return res.sendStatus(401);
  }

  // Попытываемся верифицировать токен с помощью секретного ключа access
  try {
    const decoded = jwt.verify(token, signatureAccess);
    // Если верификация прошла успешно, сохраняем декодированные данные в req.user
    req.user = decoded;
  } catch (err) {
    // В случае ошибки верификации отправляем ответ с кодом 401 Unauthorized
    return res.sendStatus(401);
  }
  // Продолжаем обработку запроса следующим middleware или обработчиком
  return next();
};

// Middleware для проверки refresh токена
const verifyRefreshTokenMiddleware = (req, res, next) => {
  // Извлекаем refresh токен из cookies, если он присутствует
  const refreshToken = req.cookies.refreshToken;

  // Если токен отсутствует, отправляем ответ с кодом 401 Unauthorized
  if (!refreshToken) {
    return res.sendStatus(401);
  }

  // Попытываемся верифицировать токен с помощью секретного ключа refresh
  try {
    const decoded = jwt.verify(refreshToken, signatureRefresh);
    // Если верификация прошла успешно, сохраняем декодированные данные в req.user
    req.user = decoded;
  } catch (err) {
    // В случае ошибки верификации отправляем ответ с кодом 401 Unauthorized
    return res.sendStatus(401);
  }
  // Продолжаем обработку запроса следующим middleware или обработчиком
  return next();
};

// Функция для генерации пары токенов (access и refresh) для пользователя
const getTokens = (login) => ({
  accessToken: jwt.sign({ login }, signatureAccess, {
    expiresIn: `${accessTokenAge}s`, // Указываем время жизни access токена
  }),
  refreshToken: jwt.sign({ login }, signatureRefresh, {
    expiresIn: `${refreshTokenTokenAge}s`, // Указываем время жизни refresh токена
  }),
});

// Экспортируем функции и переменные для использования в других частях приложения
module.exports = {
  getTokens,
  refreshTokenTokenAge,
  verifyAuthorizationMiddleware,
  verifyRefreshTokenMiddleware,
};
