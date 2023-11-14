import React, {useEffect, useState} from 'react';
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
import {animationInfoBlock, reverseAnimationInfoBlock} from "./animation/RoomInfoAnimation";
import {fetchRoomData} from "./services/bookingService";
import authForm from "./components/AuthForm/AuthForm";
import {MaterialIcon, SvgIcon} from "./utils/components/icons";
import jwtDecode from "jwt-decode";

const App = () => {

  const [isNewBookingFormOpen, setNewBookingFormOpen] = useState(false);
  const [isAuthFromOpen, setAuthFromOpen] = useState(false);

  const [roomDataArray, setRoomDataArray] = useState([]);
  const [isInfoBlock, setInfoBlock] = useState(true);
  const [infoBlockData, setInfoBlockData] = useState({});

  const [dateResponse, setDateResponse] = useState(new Date());

  const [userFullname, setUserFullname] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const [stomp, setStomp] = useState(null);
  const [newDataAvia, updateNewDataAvia] = useState(false);

  const [infoMessage, setInfoMessage] = useState(null);

  const [inputValue, setInputValue] = useState('');
  const [autocompleteInputValue, setAutocompleteInputValue] = useState('');


  const [popupState, setPopupState] = useState({
    authForm: false,
    newBookingForm: false
  })

  const [userCredentials, setUserCredentials] = useState({
    fullName: undefined,
    role: undefined
  })

  useEffect(() => {
    try {
      const jwt = localStorage.getItem('token');
      if (jwt) {
        const decodedClaims = jwtDecode(jwt);
        setUserCredentials({
          fullName: decodedClaims.fullName,
          role: decodedClaims.role
        })
      } else {
        console.error('JWT не найден в localStorage');
      }
    } catch (error) {
      console.error('Ошибка при парсинге или декодировании JWT:', error);
    }
  }, []);

  const openPopup = (popupName) => {
    setPopupState((prevPopupElementsState) => ({
      ...prevPopupElementsState,
      [popupName]: true,
    }));
  };

  const closePopup = (popupName) => {
    setPopupState((prevPopupElementsState) => ({
      ...prevPopupElementsState,
      [popupName]: false,
    }));
  };


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


  useEffect(() => {
    fetchRoomData(dateResponse, setRoomDataArray, setAuthFromOpen, handleFetchError);
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


  // const openPopup = () => {
  //     setAuthFromOpen(true);
  // };
  //
  // const closePopup = () => {
  //     setAuthFromOpen(false);
  // };


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
            <button className='login-button' onClick={() => openPopup('authForm')}>
              <span className="material-icons account_circle">account_circle</span>
              {userCredentials.fullName === undefined ? 'Войти' : userCredentials.fullName + ' (' + userCredentials.role + ')'}
            </button>
          </div>
          <AnimatePresence>
            {popupState.authForm && (
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
                    <AuthForm onClose={() => closePopup('authForm')} fetchBookingData={fetchRoomData}
                              setInfoMessage={setInfoMessage}/>
                  </motion.div>
                </motion.div>
            )}
          </AnimatePresence>
          <h1>Smart Campus | Кафедра 806</h1>

          <MaterialIcon iconName="safety_check" size="32px" color="#0095DA"/>

          <SvgIcon
              svgContent={
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                  <path
                      d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"/>
                </svg>
              }
              size="32px"
              color="#4CAF50"
          />

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
              <BookingRoomComponent funcClickDiv={(div) => {
                // setInfoBlock(false);
                animationInfoBlock(div, setInfoBlock);

              }} updateDataInfoBlock={setInfoBlockData}
                                    key={index} {...roomData} />
          ))}

        </div>

        <div id='Info-Block' className='Info' hidden={isInfoBlock} onClick={() => {
          reverseAnimationInfoBlock(setInfoBlock, infoBlockData.id);
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