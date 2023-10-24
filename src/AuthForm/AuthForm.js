// AuthForm.js

import React, { useState } from 'react';
import axios from 'axios';
import './AuthForm.css'

const AuthForm = ({ onClose }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
  };

  const handleSubmit = async () => {
    try {
      // Отправка запроса на сервер для входа или регистрации
      const endpoint = isRegistering ? 'your_register_endpoint' : 'your_login_endpoint';
      const response = await axios.post(endpoint, { username, password, email });

      if (response.status === 200) {
        // Получение токена из ответа сервера
        const { token } = response.data;

        // Сохранение токена в local storage
        localStorage.setItem('token', token);

        // Дополнительные действия после успешного входа или регистрации
        // Например, перенаправление на другую страницу

        // Закрыть всплывающее окно
        onClose();
      } else {
        // Обработка ошибок входа или регистрации
        console.error('Аутентификация не удалась');
      }
    } catch (error) {
      console.error('Ошибка во время аутентификации:', error);
    }
  };

  return (
      <div className="form-container">
        <button className="close-button" onClick={onClose}>✖</button>
        <h2>{isRegistering ? 'Регистрация' : 'Вход'}</h2>
        <form>
          <label>
            Имя пользователя:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Пароль:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          {isRegistering && (
              <label>
                Электронная почта:
                <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
              </label>
          )}
          <button type="button" onClick={() => {handleSubmit(); onClose();}}>
            {isRegistering ? 'Зарегистрироваться' : 'Войти'}
          </button>
          <p>
            {isRegistering
                ? 'Уже есть аккаунт?'
                : 'Нет аккаунта? '}
            <button type="button" onClick={() => {handleToggleMode(); onClose();}}>
              {isRegistering ? 'Войти' : 'Зарегистрироваться'}
            </button>
          </p>
        </form>
      </div>
  );
};

export default AuthForm;