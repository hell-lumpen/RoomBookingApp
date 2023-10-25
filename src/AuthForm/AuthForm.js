import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

import './AuthForm.css'

const AuthForm = ({ onClose, fetchData }) => {

  const config = require('../config');

  const [isRegistering, setIsRegistering] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
  };

  const handleSubmit = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'http://localhost:3000',
      };

      const endpoint = isRegistering ? `http://${config.hostName}:${config.port}/api/auth/register` : `http://${config.hostName}:${config.port}/api/auth/login`;
      const response = await axios.post(endpoint, { username, password }, {headers});
      if (response.status === 200) {
        // Получение токена из ответа сервера
        const { token } = response.data;

        localStorage.setItem('token', token);
        fetchData();

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
        <motion.button
            className="close-button"
            onClick={onClose}
        >
          ✖
        </motion.button>
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
                    onClick={() => { handleSubmit(); }}
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