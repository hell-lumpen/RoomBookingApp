import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import BookingRoomComponent from "./RoomContainer/RoomContainer";
import RoomInfoBlockComponent from "./RoomInfoBlockComponent/RoomInfoBlockComponent";
import NewBookingComponent from "./NewBookingComponent/NewBookingComponent";
import AuthForm from "./AuthForm/AuthForm";
import {motion, AnimatePresence} from "framer-motion";

const App = () => {
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
    const [isNewBooking, setNewBooking] = useState(true);
    const [infoBlockData, setInfoBlockData] = useState({});
    const [dateResponse, setDateResponse] = useState(new Date());

    const formatDate = (d) => {
        const padWithZero = (number) => String(number).padStart(2, '0');
        const year = d.getFullYear();
        const month = padWithZero(d.getMonth() + 1);
        const day = padWithZero(d.getDate());
        return `${year}-${month}-${day}T00:00:00`;
    };

    const handleFetchError = (error) => {
        if (error.response) {
            console.error('Error response data:', error.response.data);
            if (error.response.status === 403) {
                setPopupOpen(true);
            } else if (error.response.status === 500) {
                // Обработка ошибки 500
            }
        } else if (error.request) {
            console.error('No response received');
        } else {
            console.error('Error setting up the request:', error.message);
        }
    };

    const fetchRoomData = async () => {
        try {
            const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VybmFtZTEiLCJpYXQiOjE2OTgwNzEzMzEsImV4cCI6MTY5ODY3NjEzMX0.trcNRuEYO7iQIJ-GWvA-ezDen6QKJG2AWwiwsnOBxjI';

            const headers = {
                Authorization: 'Bearer ' + token,
            };

            const currentDate = dateResponse;
            const nextDate = new Date(currentDate.getTime() + 1000 * 60 * 60 * 24);

            const startTime = formatDate(currentDate);
            const endTime = formatDate(nextDate);

            const response = await axios.get(
                `http://10.10.69.65:8080/api/bookings?startTime=${startTime}&endTime=${endTime}`,
                { headers }
            );

            setRoomDataArray(response.data);
            return response.data;
        } catch (error) {
            handleFetchError(error);
            throw error;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchRoomData();
                // Далее можно выполнить дополнительные действия с полученными данными, если это необходимо
            } catch (error) {
                // Обработка ошибки, если необходимо
            }
        };

        fetchData();
    }, [dateResponse]);

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

    const [isPopupOpen, setPopupOpen] = useState(false);

    const openPopup = () => {
        setPopupOpen(true);
    };

    const closePopup = () => {
        setPopupOpen(false);
    };

    return (
        <div>
            <div className="App">
                <div className="login-button-container">
                    <button className='login-button' onClick={openPopup}><span className="material-icons account_circle">account_circle</span>Войти</button>
                </div>
                <AnimatePresence>
                    {isPopupOpen && (
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
                                exit={{ y: "-50%", opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                                <AuthForm onClose={closePopup} />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <h1>Бронирование аудиторий IT-этажа</h1>
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
                            setNewBooking(false);
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


            <div id='new-booking-background-block' className='new-booking-background-block' hidden={isNewBooking} onClick={()=>{setNewBooking(true)}} z->
                <NewBookingComponent call_function={setNewBooking}/>
            </div>

        </div>

    );
};

export default App;