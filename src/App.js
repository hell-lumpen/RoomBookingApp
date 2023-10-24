import React, {useEffect, useState} from 'react';
import axios from 'axios';
import './App.css';
import BookingRoomComponent from "./RoomContainer/RoomContainer";
import RoomInfoBlockComponent from "./RoomInfoBlockComponent/RoomInfoBlockComponent";
import NewBookingComponent from "./NewBookingComponent/NewBookingComponent";

const App = () => {




    const mocRoomDataArray = [
        {
            "roomName": "Переговорка 1",
            "bookings": [
                {
                    "id": 1,
                    "startTime": "2023-01-05T10:00:00",
                    "endTime": "2023-01-05T12:00:00",
                    "bookingPurpose": "Совещание",
                    "username": "Крылов Сергей Сергеевич"
                },
                {
                    "id": 2,
                    "startTime": "2023-01-08T14:00:00",
                    "endTime": "2023-01-08T16:00:00",
                    "bookingPurpose": "Презентация",
                    "username": "Полей-Добронравова Амелия Александровна"
                }
            ]
        },
        {
            "roomName": "Конференц-зал A",
            "bookings": [
                {
                    "id": 3,
                    "startTime": "2023-01-07T09:00:00",
                    "endTime": "2023-01-07T11:00:00",
                    "bookingPurpose": "Обсуждение проекта",
                    "username": "Булакина Мария Борисовна"
                }
            ]
        }
    ];
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

    const [roomDataArray, setRoomDataArray] = useState(mocRoomDataArray);
    const [isInfoBlock, setInfoBlock] = useState(true);
    const [isNewBooking, setNewBooking] = useState(true);
    const [infoBlockData, setInfoBlockData] = useState({});
    const [dateResponse, setDateResponse] = useState(new Date());

    const fetchRoomData = () => {
        try {
            const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VybmFtZTEiLCJpYXQiOjE2OTgwNzEzMzEsImV4cCI6MTY5ODY3NjEzMX0.trcNRuEYO7iQIJ-GWvA-ezDen6QKJG2AWwiwsnOBxjI';

            var base64Url = token.split('.')[1];
            var decoded = JSON.parse(window.atob(base64Url))

            console.log(decoded);

            const headers = {
                Authorization: 'Bearer ' + token,
            }

            const date = dateResponse;
            console.log(dateResponse);
            console.log(date);
            const year = date.getFullYear();
            let month = String(date.getMonth() + 1).padStart(2, '0');
            let day = String(date.getDate()).padStart(2, '0');

            const date1 = new Date(date.getTime() + 1000 * 60 * 60 * 24);
            const month1 = String(date1.getMonth() + 1).padStart(2, '0');
            const day1 = String(date1.getDate()).padStart(2, '0');

            // console.log('url',
            //     'http://127.0.0.1:8080/api/bookings?startTime=' + year + '-' + month + '-' + day + 'T15:00:00&endTime='+year+'-'+month1+'-'+day1+'T00:00:00',
            // );
            // axios.get(
            //     'http://127.0.0.1:8080/api/room/all',
            //     {headers}
            // ).then(
            //     (response) => {
            //
            //
            //         console.log('asd', response.data);
            //     }
            // );

            axios.get(
                'http://10.10.69.65:8080/api/bookings?startTime=' + year + '-' + month + '-' + day + 'T00:00:00&endTime=' + year + '-' + month1 + '-' + day1 + 'T00:00:00',
                {headers}
            ).then(
                (response) => {

                    setRoomDataArray(response.data);
                    console.log('end function axios')
                }
            );
            // console.log('response', response);
        } catch (error) {
            console.error('Ошибка при получении данных:', error);
            setRoomDataArray(mocRoomDataArray);
        }
    };

    useEffect(() => {

        fetchRoomData();
    }, [dateResponse]);

    // fetchRoomData();


    const todayDayClick = () => {
        setDateResponse(new Date());
        // fetchRoomData();
    };

    const setTime = () => {
        const d1 = dateResponse;
        const d2 = new Date(d1.getTime() + 1000 * 60 * 60 * 24);
        setDateResponse(d2);
        console.log('d1', d1);
        console.log('d2', d2);
        console.log('d3', dateResponse);
    }

    const nextDayClick = () => {
        setTime();
        // fetchRoomData();

    };

    const backDayClick = () => {
        setDateResponse(new Date(dateResponse.getTime() - 1000 * 60 * 60 * 24));

    }

    const getMonth = () => {
        switch (dateResponse.getMonth()) {
            case(0):
                return 'января';
            case(1):
                return 'февраля';
            case(2):
                return 'марта';
            case(3):
                return 'апреля';
            case(4):
                return 'мая';
            case(5):
                return 'июня';
            case(6):
                return 'июля';
            case(7):
                return 'августа';
            case(8):
                return 'сентября';
            case(9):
                return 'октября';
            case(10):
                return 'ноября';
            case(11):
                return 'декабря';
        }
    }
    return (
        <div>
            <div className="App">
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


            <div id='new-booking-background-block' className='new-booking-background-block' hidden={isNewBooking}>
                <NewBookingComponent call_function={setNewBooking}/>
            </div>

        </div>

    );
};

export default App;