import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

import './AuthForm.css'

const AuthForm = ({ onClose, fetchData }) => {

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      const button = document.getElementById('submitLoginButton');
      if (button) {
        button.click();
      }
    }
  });

  const config = require('../config');

  const [isRegistering, setIsRegistering] = useState(false);
  const [successAuth, setSuccessAuth] = useState(true);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isAppleDevice = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);

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

        const { token } = response.data;
        localStorage.setItem('token', token);

        fetchData();
        setSuccessAuth(true)
        onClose();
      } else {
        console.error(response.data)
        setSuccessAuth(false);
      }
    } catch (error) {
      setSuccessAuth(false);
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
                {!successAuth ? (
                    <p style={{color: "red", marginBottom: "5px", marginTop: "5px"}}>
                      Неверное имя пользователя или пароль
                    </p>
                ) : null}
              </>
            ) : (
                <p>
                  Регистрация пользователей недоступна
                </p>
            )
          }

          {!isRegistering ? (
              <>
                <div className="login-in-form-button-container">
                  <motion.button
                      id="submitLoginButton"
                      type="button"
                      className="login-button-in-form"
                      onClick={() => { handleSubmit(); }}
                  >
                    <span className="material-icons login-icon">login</span> Войти
                  </motion.button>
                </div>
                {isAppleDevice ? (
                    <div className="passkey-in-form-button-container">
                      <motion.button
                          type="button"
                          className="passkey-button-in-form"
                          onClick={() => { handleSubmit();
                          }}
                      >
                        <span className="material-symbols-outlined passkey">passkey</span> Войти используя Passkey
                      </motion.button>
                    </div>
                ) : null}
              </>
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