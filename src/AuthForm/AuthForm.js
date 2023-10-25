import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

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
      <motion.div
          className="form-container"
          initial={{ y: "-50%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "-50%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/*<motion.button*/}
        {/*    className="close-button"*/}
        {/*    onClick={onClose}*/}
        {/*>*/}
        {/*  ✖*/}
        {/*</motion.button>*/}
        <motion.h2>
          {isRegistering ? 'Регистрация' : 'Вход'}
        </motion.h2>
        <form>
          { !isRegistering ?
            (
              <>
                <label>
                  Имя пользователя:
                  <input placeholder="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>

                <label>
                  Пароль:
                  <input placeholder="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
              </>
            ) : (
                <p>
                  Регистрация пользователей недоступна
                </p>
            )
          }

          {!isRegistering ? (
              <div className="login-in-form-button-container">
                <motion.button
                    type="button"
                    className="login-button-in-form"
                    onClick={() => { handleSubmit(); onClose(); }}
                >
                  <span className="material-icons login-icon">login</span> Войти
                </motion.button>
              </div>
          ) : null}

          <div className="registration-in-form-container">

            <p>
              {isRegistering
                ? 'Уже есть аккаунт?'
                : 'Нет аккаунта? '}
            </p>
            <motion.button
                type="button"
                onClick={() => { handleToggleMode();}}
                className="login-button-in-form"
            >
              {isRegistering ? 'Войти' : 'Зарегистрироваться'}
            </motion.button>
          </div>
        </form>
      </motion.div>
  );
};

export default AuthForm;