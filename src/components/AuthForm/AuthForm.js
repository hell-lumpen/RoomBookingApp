import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

import './AuthForm.css'

const AuthForm = ({ onClose, fetchBookingData, setInfoMessage }) => {

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      const button = document.getElementById('submitLoginButton');
      if (button) {
        button.click();
      }
    }
  });

  const [isRegistering, setIsRegistering] = useState(false);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const isAppleDevice = /iPad|iPhone|iPod|Macintosh/.test(navigator.userAgent);

  const handleToggleMode = () => {
    setIsRegistering(!isRegistering);
  };

  const fetchAuthData = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': `http://${process.env.REACT_APP_API_DEV_HOST}:${process.env.REACT_APP_API_DEV_PORT}`,
      };

      const endpoint = isRegistering
          ? `http://${process.env.REACT_APP_API_DEV_HOST}:${process.env.REACT_APP_API_DEV_PORT}/api/auth/register`
          : `http://${process.env.REACT_APP_API_DEV_HOST}:${process.env.REACT_APP_API_DEV_PORT}/api/auth/login`;

      const response = await axios.post(endpoint, { username, password }, { headers });

      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem('token', token);
        fetchBookingData();
        onClose();
      }
    } catch (error) {
      console.log(error)
      if (error.response.data.status !== 200) {
        setPassword('')
        if (error.response.data.exception_description) {
          setInfoMessage(error.response.data.exception_description);
        }
        else {
          setInfoMessage('Возникла непредвиденная ошибка');
        }
      }
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
        <motion.h2>
          {isRegistering ? 'Регистрация в Smart Campus' : 'Вход в Smart Campus'}
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
              <>
                <div className="login-in-form-button-container">
                  <motion.button
                      id="submitLoginButton"
                      type="button"
                      className="login-button-in-form"
                      onClick={() => { fetchAuthData(); }}
                  >
                    <span className="material-icons login-icon">login</span> Войти
                  </motion.button>
                </div>
                {isAppleDevice ? (
                    <div className="passkey-in-form-button-container">
                      <motion.button
                          type="button"
                          className="passkey-button-in-form"
                          onClick={() => { fetchAuthData();
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