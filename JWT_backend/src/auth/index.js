// Импорт необходимых модулей и функций
const express = require("express"); // Основной модуль для создания сервера
const crypto = require("crypto"); // Модуль для шифрования паролей
const cookie = require("cookie"); // Модуль для работы с cookies
const {
  getTokens, // Функция для генерации JWT токенов
  refreshTokenTokenAge, // Время жизни refresh токена
  verifyAuthorizationMiddleware, // Мiddleware для проверки авторизации
  verifyRefreshTokenMiddleware, // Мiddleware для проверки refresh токена
} = require("./utils");
const { passwordSecret, fakeUser } = require("./data"); // Секретный ключ для хэширования паролей и тестовые данные пользователя

// Создаем новый роутер для аутентификации
const authRouter = express.Router();

// Маршрут для входа в систему
authRouter.post("/login", (req, res) => {
  // Извлекаем логин и пароль из тела запроса
  const { login, password } = req.body;

  // Генерируем хеш от пароля с использованием секретного ключа
  const hash = crypto
    .createHmac("sha256", passwordSecret)
    .update(password)
    .digest("hex");
  
  // Проверяем, совпадает ли хеш от введенного пароля с хешем, хранящимся в системе
  const isVerifiedPassword = hash === fakeUser.passwordHash;

  // Если логин или пароль неверны, отправляем ответ с кодом 401 (Unauthorized)
  if (login !== fakeUser.login || !isVerifiedPassword) {
    return res.status(401).send("Login fail");
  }

  // Генерируем access и refresh токены
  const { accessToken, refreshToken } = getTokens(login);

  // Устанавливаем cookie с refresh токеном
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refreshToken", refreshToken, {
      httpOnly: true, // Cookie доступна только через HTTP, недоступна в JavaScript
      maxAge: refreshTokenTokenAge, // Время жизни cookie
    })
  );

  // Отправляем access токен в ответе
  res.send({ accessToken });
});

// Маршрут для обновления access токена
authRouter.get("/refresh", verifyRefreshTokenMiddleware, (req, res) => {
  // Генерируем новые access и refresh токены
  const { accessToken, refreshToken } = getTokens(req.user.login);

  // Устанавливаем новое время жизни для refresh токена
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60, // 1 час
    })
  );

  // Отправляем новый access токен в ответе
  res.send({ accessToken });
});

// Маршрут для получения профильного профиля пользователя
authRouter.get("/profile", verifyAuthorizationMiddleware, (req, res) => {
  // Отправляем строку "admin" в ответе, имитируя получение данных профиля
  res.send("admin");
});

// Маршрут для выхода из системы
authRouter.get("/logout", (req, res) => {
  // Удаляем cookie с refresh токеном, устанавливая его время жизни в 0
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("refreshToken", "", {
      httpOnly: true,
      maxAge: 0,
    })
  );

  // Отправляем статус 200 OK в ответе
  res.sendStatus(200);
});

// Экспортируем роутер для использования в других частях приложения
module.exports = authRouter;