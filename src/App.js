import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MeetingRoomComponent from './RoomContainer/RoomContainer';
import './App.css';

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

  const [roomDataArray, setRoomDataArray] = useState([]);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/booking');
        setRoomDataArray(response.data);
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
        setRoomDataArray(mocRoomDataArray);
      }
    };

    fetchRoomData();
  }, []);

  return (
      <div className="App">
        <h1>Бронирование аудиторий</h1>
        {roomDataArray.map((roomData, index) => (
            <MeetingRoomComponent key={index} {...roomData} />
        ))}
      </div>
  );
};

export default App;