import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import './index.css'
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import BookingRoomComponent from "./RoomContainer/RoomContainer";
import RoomInfoBlockComponent from "./RoomInfoBlockComponent/RoomInfoBlockComponent";
import NewBookingComponent from "./NewBookingComponent/NewBookingComponent";
import AuthForm from "./AuthForm/AuthForm";
import {motion, AnimatePresence} from "framer-motion";
import jwt_decode from 'jwt-decode';

const App = key => {

    const animationInfoBlock = (div) => {
        setInfoBlock(false);
        console.log('target', div);

        const top = document.getElementById(div).offsetTop + 'px';
        console.log('top', top);

        document.getElementById('Info-Block').style.pointerEvents = 'auto';
        document.documentElement.style.setProperty('--position_y_center', top);

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


        console.log('asdasd');

        document.getElementById('Info-Block').classList.add('state2');

        document.getElementById('room-info-block').classList.add('state2');
    }

    const [roomDataArray, setRoomDataArray] = useState([]);
    const [isInfoBlock, setInfoBlock] = useState(true);
    const [isNewBookingFormOpen, setNewBookingFormOpen] = useState(false);
    const [infoBlockData, setInfoBlockData] = useState({});
    const [dateResponse, setDateResponse] = useState(new Date());

    const [userFullname, setUserFullname] = useState(null);
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
                // `http://10.10.69.65:8080/api/bookings?startTime=${startTime}&endTime=${endTime}`,
                { headers }
            );

            console.log('data', response.data);
            setRoomDataArray(response.data);
            setAuthFromOpen(false);
            console.log('4', roomDataArray);
            return response.data;
        } catch (error) {
            handleFetchError(error);
        }
    };

    useEffect(() => {
        // const fetchData = async () => {
        //     try {
        //         const data = await fetchRoomData();
        //         // Далее можно выполнить дополнительные действия с полученными данными, если это необходимо
        //     } catch (error) {
        //         // Обработка ошибки, если необходимо
        //     }
        // };

        fetchRoomData();
    }, [dateResponse, newDataAvia]);


    useEffect(() => {
        const token = localStorage.getItem('token');

        const headers = {
            Authorization: 'Bearer ' + token,
        };

        let sock = new SockJS(`http://${process.env.REACT_APP_API_DEV_HOST}:${process.env.REACT_APP_API_DEV_PORT}/gs`,
            {headers}    );
        let stompClient = Stomp.over(sock);
        sock.onopen = function () {
            console.log('open');
        }


        stompClient.connect({}, ()=>{
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

    const acceptDataStomp =(data) => {
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

    return (
        <div>
            <div className="App">
                <div className="login-button-container">
                    <button className='login-button' onClick={openPopup}><span className="material-icons account_circle">account_circle</span>
                        {userFullname === null ? 'Войти' : userFullname}
                    </button>
                </div>
                <AnimatePresence>
                    {isAuthFromOpen && (
                        <motion.div
                            className="popup-container"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.1 }}
                        >
                            <motion.div
                                className="popup-content"
                                initial={{ y: "-50%", opacity: 0 }}
                                animate={{ y: "0%", opacity: 1 }}
                                exit={{ y: "-50%", opacity: 0.8 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <AuthForm onClose={closePopup} fetchData={fetchRoomData} />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                {/*<h1>Smart Campus</h1>*/}
                <h1>Бронирование аудиторий</h1>
                <div className='control-panel-container'>
                    <div className='date-container-main'>
                        <button className='dfds' onClick={backDayClick}>
                            <span className="material-icons arrow">arrow_back_ios</span>
                        </button>

                        <div onClick={todayDayClick} className='date-container-text'>{['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'][dateResponse.getDay()]}, {dateResponse.getDate()} {getMonth()}</div>

                        <button className='dfds' onClick={() => {nextDayClick()}}>
                            <span className="material-icons arrow">arrow_forward_ios</span>
                        </button>
                    </div>
                    <div className="add-booking-button">
                        <button className='new-booking-button-container' onClick={()=>{
                            setNewBookingFormOpen(true);
                        }}><span className="material-icons add_circle">add_circle</span>Забронировать</button>
                    </div>
                </div>

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
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                    >
                    <motion.div
                        className="new-booking-content"
                        initial={{ y: "-50%", opacity: 0 }}
                        animate={{ y: "0%", opacity: 1 }}
                        exit={{ y: "-50%", opacity: 0.8 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
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