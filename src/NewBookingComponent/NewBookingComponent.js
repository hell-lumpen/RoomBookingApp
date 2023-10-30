// NewBookingComponent.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewBookingComponent.css';

const NewBookingComponent = ({ setNewBookingFormOpen }) => {
  const [audiences, setAudiences] = useState([]);

  useEffect(() => {
    fetchAudiences();
  }, []);

  const formatDate = (date) => {
    const padWithZero = (number) => String(number).padStart(2, '0');
    const year = date.getFullYear();
    const month = padWithZero(date.getMonth() + 1);
    const day = padWithZero(date.getDate());
    const hour = padWithZero(date.getHours());
    const minute = padWithZero(date.getMinutes());
    return `${year}-${month}-${day}T${hour}:${minute}:00`;
  };

  const fetchAudiences = () => {
    const token = localStorage.getItem('token');
    const headers = {
      Authorization: 'Bearer ' + token,
    };

    axios.get(
        `http://${process.env.REACT_APP_API_DEV_HOST}:${process.env.REACT_APP_API_DEV_PORT}/api/room/all`,
        { headers }
    )
        .then(response => {
          const allRooms = response.data.map(room => ({
            id: room.id,
            name: room.name
          }));
          setAudiences(allRooms);
        })
        .catch(error => {
          console.error('Error fetching audiences:', error.message);
        });
  };

  const handleBookingButtonClick = () => {
    const audience = document.getElementById('select-audience').value;
    const date = document.getElementById('book-date').value;
    const start_time = document.getElementById('book-start-time').value;
    const end_time = document.getElementById('book-end-time').value;
    const description = document.getElementById('book-description').value;

    if (isValidInput(audience, date, start_time, end_time, description)) {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': `http://${process.env.REACT_APP_API_DEV_HOST}:${process.env.REACT_APP_API_DEV_PORT}`,
        Authorization: 'Bearer ' + token
      };

      const { startTime, endTime } = parseDateTime(date, start_time, end_time);

      axios.post(
          `http://${process.env.REACT_APP_API_DEV_HOST}:${process.env.REACT_APP_API_DEV_PORT}/api/bookings`,
          { roomId: audience, startTime, endTime, description, rRule: null },
          { headers }
      )
          .then(response => {
            console.log('Booking successful:', response.data);
          })
          .catch(error => {
            console.error('Error during booking:', error.message);
          });
    }
  };

  const isValidInput = (audience, date, startTime, endTime, description) => {
    return audience !== 'default' && date !== '' && startTime !== '' && endTime !== '' && description !== '';
  };

  const parseDateTime = (date, startTime, endTime) => {
    const dateParts = date.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);

    const start_date = new Date(year, month, day);
    const end_date = new Date(start_date);

    const startParts = startTime.split(':');
    start_date.setHours(parseInt(startParts[0], 10), parseInt(startParts[1], 10), 0);

    const endParts = endTime.split(':');
    end_date.setHours(parseInt(endParts[0], 10), parseInt(endParts[1], 10), 0);

    return {
      startTime: formatDate(start_date),
      endTime: formatDate(end_date),
    };
  };

  return (
      <div className='new-booking-block-window-container'>
        <h2>Создание нового бронирования</h2>
        <form className="new-booking-form">
          <label className="new-booking-form-label">
            Аудитория:
            <select id="select-audience">
              <option value='default'>...</option>
              {audiences.map((room) => (
                  <option key={room.id} value={room.id}>{room.name}</option>
              ))}
            </select>
          </label>

          <div className="new-booking-datetime-container">
            <div className="new-booking-datetime-element">
              <label className="new-booking-form-datetime-element-label">
                Дата бронирования:
                <input placeholder="" type="date" onChange={(e) => {
                  // setUsername(e.target.value)
                }} />
              </label>
            </div>

            <div className="new-booking-datetime-element">
              <label className="new-booking-form-datetime-element-label">
                Время начала:
                <input placeholder="" type="time" onChange={(e) => {
                  // setUsername(e.target.value)
                }} />
              </label>
            </div>

            <div className="new-booking-datetime-element">
              <label className="new-booking-form-datetime-element-label">
                Время окончания:
                <input placeholder="" type="time" onChange={(e) => {
                  // setUsername(e.target.value)
                }} />
              </label>
            </div>
          </div>

          <label className="new-booking-form-label">
            Описание:
            <textarea className="new-booking-form-textarea" placeholder="" onChange={(e) => {
              // setUsername(e.target.value)
            }} />
          </label>
        </form>
        {/*<div className='info-block'>*/}
        {/*  <div className='title'>Аудитория:</div>*/}
        {/*  <select id="select-audience">*/}
        {/*    <option value='default'>...</option>*/}
        {/*    {audiences.map((room) => (*/}
        {/*        <option key={room.id} value={room.id}>{room.name}</option>*/}
        {/*    ))}*/}
        {/*  </select>*/}
        {/*</div>*/}

        {/*<div className='info-block'>*/}
        {/*  <div className='title'>Дата:</div>*/}
        {/*  <input id='book-date' type='date' />*/}
        {/*</div>*/}

        {/*<div className='info-block'>*/}
        {/*  <div className='title'>Время начала:</div>*/}
        {/*  <input id='book-start-time' type='time' />*/}
        {/*</div>*/}

        {/*<div className='info-block'>*/}
        {/*  <div className='title'>Время конца:</div>*/}
        {/*  <input id='book-end-time' type='time' />*/}
        {/*</div>*/}

        {/*<div className='info-block'>*/}
        {/*  <div className='title'>Описание:</div>*/}
        {/*  <input id='book-description' type='text' />*/}
        {/*</div>*/}

        {/*<div className='new-booking-buttons-container'>*/}
        {/*  <button className='new-booking-buttons-cancel' onClick={() => setNewBookingFormOpen(false)}>*/}
        {/*    Отмена*/}
        {/*  </button>*/}
        {/*  <button className='new-booking-buttons-accept' onClick={() => {*/}
        {/*    console.log('click accept');*/}
        {/*    handleBookingButtonClick();*/}
        {/*    setNewBookingFormOpen(false);*/}
        {/*  }}>*/}
        {/*    Забронировать*/}
        {/*  </button>*/}
        {/*</div>*/}
      </div>
  );
}

export default NewBookingComponent;