import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import './index.css'
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import BookingRoomComponent from "./RoomContainer/RoomContainer";
import RoomInfoBlockComponent from "./RoomInfoBlockComponent/RoomInfoBlockComponent";
import NewBookingComponent from "./NewBookingComponent/NewBookingComponent";
import AuthForm from "./components/AuthForm/AuthForm";
import {motion, AnimatePresence} from "framer-motion";
import jwt_decode from 'jwt-decode';
import Input from "./utils/components/Input";
import AutocompleteInput from "./utils/components/AutocompleteInput";
import NotificationMessage from "./utils/components/NotificationMessage";

const App = () => {
  const animationInfoBlock = (div) => {
    setInfoBlock(false);

    // const top = document.getElementById(div).offsetTop + 'px';
    let top = (window.innerHeight / 2 - document.getElementById(div).getBoundingClientRect().top
        - 200
    ) + 'px';

    console.log('divv', document.getElementById(div));

    console.log('count', document.getElementById(div).childElementCount)

    let elementChild = document.getElementById(div).firstElementChild;
    const time_title = elementChild.lastElementChild.innerHTML;
    elementChild = elementChild.nextElementSibling;
    const new_title = elementChild.textContent;
    elementChild = elementChild.nextElementSibling;
    const prepod = elementChild.innerHTML;

    document.getElementById('room-info-block-time-container').innerHTML = time_title;
    document.getElementById('room-info-block-prepod').innerHTML = prepod;


    document.getElementById('Info-Block').style.pointerEvents = 'auto';
    document.documentElement.style.setProperty('--old_position_y_center', document.getElementById(div).getBoundingClientRect().top + 'px');
    document.documentElement.style.setProperty('--position_y_center', top);
    document.documentElement.style.setProperty('--pos_y', (window.innerHeight / 2 - 200) + 'px');
    document.documentElement.style.setProperty('--width_block', (document.getElementById(div).getBoundingClientRect().width) + 'px');
    document.documentElement.style.setProperty('--height_block', (document.getElementById(div).getBoundingClientRect().height) + 'px');

    document.documentElement.style.setProperty('--new_title', new_title);

    document.getElementById(div).style.opacity = 0;

    document.getElementById('room-info-block').classList.remove('state2');
    document.getElementById('Info-Block').classList.remove('state2');

    document.getElementById('room-info-block').classList.add('state1');
    document.getElementById('Info-Block').classList.add('state1');
  }
  const eventFunc = () => {
    console.log('Анимация завершена');
    document.getElementById(infoBlockData.id).style.opacity = 1;
    document.getElementById('Info-Block').style.pointerEvents = 'none';
    setInfoBlock(true);
    console.log('Анимация завершена2');
    document.getElementById('room-info-block').removeEventListener('animationend', eventFunc);

  }
  const reverseAnimationInfoBlock = () => {
    // setInfoBlock(true);
    document.getElementById('room-info-block').addEventListener('animationend', eventFunc);

    document.getElementById('room-info-block').classList.remove('state1');
    document.getElementById('Info-Block').classList.remove('state1');

    document.getElementById('Info-Block').classList.add('state2');
    document.getElementById('room-info-block').classList.add('state2');
  }

  const [roomDataArray, setRoomDataArray] = useState([]);
  const [isInfoBlock, setInfoBlock] = useState(true);
  const [isNewBookingFormOpen, setNewBookingFormOpen] = useState(false);
  const [infoBlockData, setInfoBlockData] = useState({});
  const [dateResponse, setDateResponse] = useState(new Date());

  const [userFullname, setUserFullname] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [stomp, setStomp] = useState(null);
  const [newDataAvia, updateNewDataAvia] = useState(false);

  const formatDate = (d) => {
    const padWithZero = (number) => String(number).padStart(2, '0');
    const year = d.getFullYear();
    const month = padWithZero(d.getMonth() + 1);
    const day = padWithZero(d.getDate());
    return `${year}-${month}-${day}T00:00:00`;
  };

  const setUserClaims = () => {
    const token = localStorage.getItem('token');
    const decoded = jwt_decode(token);
    setUserFullname(decoded.fullname)
    setUserRole(decoded.role)
  }

  const handleFetchError = (error) => {
    if (error.response) {
      if (error.response.status === 403) {
        setAuthFromOpen(true);
        setRoomDataArray([]);
      } else if (error.response.status === 500) {
        setRoomDataArray([]);
      }
    } else if (error.request) {
      setAuthFromOpen(true)
    } else {
      setAuthFromOpen(true)
    }
  };

  const fetchRoomData = async () => {
    try {
      const token = localStorage.getItem('token');
      setUserClaims();

      const headers = {
        Authorization: 'Bearer ' + token,
      };

      const currentDate = dateResponse;
      const nextDate = new Date(currentDate.getTime() + 1000 * 60 * 60 * 24);

      const startTime = formatDate(currentDate);
      const endTime = formatDate(nextDate);

      const response = await axios.get(
          `http://${process.env.REACT_APP_API_DEV_HOST}:${process.env.REACT_APP_API_DEV_PORT}/api/bookings?startTime=${startTime}&endTime=${endTime}`,
          {headers}
      );

      setRoomDataArray(response.data);
      setAuthFromOpen(false);
      return response.data;
    } catch (error) {
      handleFetchError(error);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, [dateResponse, newDataAvia]);


  useEffect(() => {
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: 'Bearer ' + token,
    };

    let sock = new SockJS(`http://${process.env.REACT_APP_API_DEV_HOST}:${process.env.REACT_APP_API_DEV_PORT}/gs`,
        {headers});
    let stompClient = Stomp.over(sock);
    sock.onopen = function () {
      console.log('open');
    }


    stompClient.connect({}, () => {
          stompClient.subscribe("/topic/1", acceptDataStomp);
        }
    );

    setStomp(stompClient);
    console.log('stomp1', stompClient);
    console.log('stomp1', stomp);


  }, []);

  const connectStomp = () => {
    console.log('stomp2', stomp);
    stomp.subscribe("/topic/1", acceptDataStomp);
  }

  const acceptDataStomp = (data) => {
    updateNewDataAvia(prevState => !prevState)
  }
  const todayDayClick = () => {
    setDateResponse(new Date());
    // fetchRoomData();
  };

  const nextDayClick = () => {
    setDateResponse(new Date(dateResponse.getTime() + 1000 * 60 * 60 * 24));
  };

  const backDayClick = () => {
    setDateResponse(new Date(dateResponse.getTime() - 1000 * 60 * 60 * 24));
  };

  const getMonth = () => {
    return ['января', 'февраля', 'марта', 'апреля',
      'мая', 'июня', 'июля', 'августа',
      'сентября', 'октября', 'ноября', 'декабря'][dateResponse.getMonth()];
  };

  const [isAuthFromOpen, setAuthFromOpen] = useState(false);

  const openPopup = () => {
    setAuthFromOpen(true);
  };

  const closePopup = () => {
    setAuthFromOpen(false);
  };

  const [infoMessage, setInfoMessage] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [autocompleteInputValue, setAutocompleteInputValue] = useState('');

  const fetchSuggestions = async (input) => {
    try {
      // const response = await fetch(`/api/suggestions?input=${input}`);
      console.log(input)
      const data = {
        "suggestions": [
          {
            "id": 1,
            "value": "Мероприятие 1 Мероприятие 1 Мероприятие 1 Мероприятие 1 Мероприятие 1 Мероприятие 1 Мероприятие 1 Мероприятие 1 "
          },
          {"id": 2, "value": "Мероприятие 2"},
          {"id": 3, "value": "Мероприятие 3"}
        ]
      }
      return data.suggestions; // Предполагается, что сервер возвращает массив объектов с полями id и value
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };

  const [selectedItem, setSelectedItem] = React.useState(null);

  // Обработчик выбора объекта из списка
  const handleSelect = (selected) => {
    setSelectedItem(selected);
    console.log('Выбран объект:', selected);
  };

  return (
      <div>
        <div className="App">
          <NotificationMessage message={infoMessage} setMessage={setInfoMessage} messageType={'error'}/>
          <div className="login-button-container">
            <button className='login-button' onClick={openPopup}><span
                className="material-icons account_circle">account_circle</span>
              {userFullname === null ? 'Войти' : userFullname + ' (' + userRole + ')'}
            </button>
          </div>
          <AnimatePresence>
            {isAuthFromOpen && (
                <motion.div
                    className="popup-container"
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    exit={{opacity: 0}}
                    transition={{duration: 0.1}}
                >
                  <motion.div
                      className="popup-content"
                      initial={{y: "-50%", opacity: 0}}
                      animate={{y: "0%", opacity: 1}}
                      exit={{y: "-50%", opacity: 0.8}}
                      transition={{duration: 0.3, ease: "easeInOut"}}
                  >
                    <AuthForm onClose={closePopup} fetchBookingData={fetchRoomData} setInfoMessage={setInfoMessage}/>
                  </motion.div>
                </motion.div>
            )}
          </AnimatePresence>
          <h1>Smart Campus | Кафедра 806</h1>
          <h3 style={{textAlign: "center"}}>Бронирование аудиторий</h3>
          <div className='control-panel-container'>
            <div className='date-container-main'>
              <button className='dfds' onClick={backDayClick}>
                <span className="material-icons arrow">arrow_back_ios</span>
              </button>

              <div onClick={todayDayClick}
                   className='date-container-text'>{['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'][dateResponse.getDay()]}, {dateResponse.getDate()} {getMonth()}</div>

              <button className='dfds' onClick={() => {
                nextDayClick()
              }}>
                <span className="material-icons arrow">arrow_forward_ios</span>
              </button>
            </div>
            <div className="add-booking-button">
              <button className='new-booking-button-container' onClick={() => {
                setNewBookingFormOpen(true);
              }}><span className="material-icons add_circle">add_circle</span>Забронировать
              </button>
            </div>
          </div>
          <Input placeholder="Введите название мероприятия, аудитории или ФИО организатора"
                 inputValueState={[inputValue, setInputValue]}
                 type="text"
                 onChange={(e) => {
                   setInputValue(e.target.value)
                 }}
                 showClearButton={true}
                 validate={(value) => value.length >= 5}
          />
          {inputValue && (<div>Вы ввели: {inputValue}</div>)}

          <AutocompleteInput
              fetchSuggestions={fetchSuggestions}
              onChange={(e) => {
                setAutocompleteInputValue(e.target.value)
              }}
              inputValueState={[autocompleteInputValue, setAutocompleteInputValue]}
              placeholder='Начни вводить, чтобы получить подсказки'
              type='text'
              showClearButton={true}
              validate={(value) => value.length >= 3}
              onSelect={handleSelect}
          />
          {selectedItem && (
              <div>
                Выбран объект: {selectedItem.value} (ID: {selectedItem.id})
              </div>
          )}

          {roomDataArray.map((roomData, index) => (
              <BookingRoomComponent funcClickDiv={animationInfoBlock} updateDataInfoBlock={setInfoBlockData}
                                    key={index} {...roomData} />
          ))}

        </div>

        <div id='Info-Block' className='Info' hidden={isInfoBlock} onClick={() => {
          reverseAnimationInfoBlock()
        }}>
          <RoomInfoBlockComponent data={infoBlockData}/>
        </div>

        <AnimatePresence>
          {isNewBookingFormOpen && (
              <motion.div
                  className="popup-container"
                  initial={{opacity: 0}}
                  animate={{opacity: 1}}
                  exit={{opacity: 0}}
                  transition={{duration: 0.1}}
              >
                <motion.div
                    className="new-booking-content"
                    initial={{y: "-50%", opacity: 0}}
                    animate={{y: "0%", opacity: 1}}
                    exit={{y: "-50%", opacity: 0.8}}
                    transition={{duration: 0.3, ease: "easeInOut"}}
                >
                  <NewBookingComponent setNewBookingFormOpen={setNewBookingFormOpen}/>
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

export default App;