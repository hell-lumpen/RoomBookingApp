import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewBookingComponent.css';
import '../index.css';
import CustomInputParticipantComponent from "../CustomInputParticipant/CustomInputParticipantComponent";

const NewBookingComponent = ({ setNewBookingFormOpen }) => {
  const [audiences, setAudiences] = useState([]);
  const [isPeriodicSettingsOpen, setPeriodicSettingsOpen] = useState(false);

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

    axios
        .get(
            `http://${process.env.REACT_APP_API_DEV_HOST}:${process.env.REACT_APP_API_DEV_PORT}/api/room/all`,
            { headers }
        )
        .then((response) => {
          const allRooms = response.data.map((room) => ({
            id: room.id,
            name: room.name,
          }));
          setAudiences(allRooms);
        })
        .catch((error) => {
          console.error('Error fetching audiences:', error.message);
        });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBookingFormData({ ...newBookingFormData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isValidInput(newBookingFormData)) {
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': `http://${process.env.REACT_APP_API_DEV_HOST}:${process.env.REACT_APP_API_DEV_PORT}`,
        Authorization: 'Bearer ' + token,
      };

      const { startTime, endTime } = parseDateTime(
          newBookingFormData.date,
          newBookingFormData.startTime,
          newBookingFormData.endTime
      );

      const postData = {
        roomId: newBookingFormData.roomId,
        startTime,
        endTime,
        description: newBookingFormData.description,
        rRule: null,
      };

      console.log(postData);

      axios
          .post(
              `http://${process.env.REACT_APP_API_DEV_HOST}:${process.env.REACT_APP_API_DEV_PORT}/api/bookings`,
              postData,
              { headers }
          )
          .then((response) => {
            console.log('Booking successful:', response.data);
          })
          .catch((error) => {
            console.error('Error during booking:', error.message);
          });
    }
  };

  const isValidInput = (formData) => {
    return (
        formData.roomId !== '' &&
        formData.date !== '' &&
        formData.startTime !== '' &&
        formData.endTime !== '' &&
        formData.description !== ''
    );
  };

  const parseDateTime = (date, startTime, endTime) => {
    const dateParts = date.split('-');
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;
    const day = parseInt(dateParts[2], 10);

    const start_date = new Date(year, month, day);
    const end_date = new Date(start_date);

    const startParts = startTime.split(':');
    start_date.setHours(
        parseInt(startParts[0], 10),
        parseInt(startParts[1], 10),
        0
    );

    const endParts = endTime.split(':');
    end_date.setHours(
        parseInt(endParts[0], 10),
        parseInt(endParts[1], 10),
        0
    );

    return {
      startTime: formatDate(start_date),
      endTime: formatDate(end_date),
    };
  };

  const [newBookingFormData, setNewBookingFormData] = useState({
    roomId: '',
    date: '',
    startTime: '',
    endTime: '',
    description: '',
  });

  return (
      <div className='new-booking-block-window-container'>
        <h2>Создание нового бронирования</h2>
        <form className='new-booking-form' onSubmit={handleSubmit}>
          <label className='new-booking-form-label'>
            Аудитория:
            <select
                name='roomId'
                value={newBookingFormData.roomId}
                onChange={handleInputChange}
            >
              <option value='default'>...</option>
              {audiences.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
              ))}
            </select>
          </label>

          <div className='new-booking-datetime-container'>
            <div className='new-booking-datetime-element'>
              <label className='new-booking-form-datetime-element-label'>
                Дата бронирования:
                <input
                    type='date'
                    name='date'
                    value={newBookingFormData.date}
                    onChange={handleInputChange}
                />
              </label>
            </div>

            <div className='new-booking-datetime-element'>
              <label className='new-booking-form-datetime-element-label'>
                Время начала:
                <input
                    type='time'
                    name='startTime'
                    value={newBookingFormData.startTime}
                    onChange={handleInputChange}
                />
              </label>
            </div>

            <div className='new-booking-datetime-element'>
              <label className='new-booking-form-datetime-element-label'>
                Время окончания:
                <input
                    type='time'
                    name='endTime'
                    value={newBookingFormData.endTime}
                    onChange={handleInputChange}
                />
              </label>
            </div>
          </div>

          <label className='new-booking-form-label'>
            Описание:
            <textarea
                className='new-booking-form-textarea'
                name='description'
                value={newBookingFormData.description}
                onChange={handleInputChange}
            />
          </label>
          <CustomInputParticipantComponent/>
          <button
              type='button'
              style={{
                color: '#000',
                padding: '0',
                marginTop: '10px',
                marginBottom: '10px',
                borderRadius: '5px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                background: 'none',
                fontFamily: 'Geologica',
                fontWeight: 400,
                textAlign: 'left',
              }}
              onClick={() => {
                setPeriodicSettingsOpen(!isPeriodicSettingsOpen);
              }}
          >
            {isPeriodicSettingsOpen ? (
                'Скрыть настройки периодичности'
            ) : (
                'Показать настройки периодичности'
            )}
          </button>

          {isPeriodicSettingsOpen ? (
              <div className='new-booking-datetime-container'>
                <div className='new-booking-datetime-element'>
                  <label className='new-booking-form-datetime-element-label'>
                    Время окончания:
                    <input
                        placeholder='10:00'
                        type='time'
                        onChange={(e) => {
                          // setUsername(e.target.value)
                        }}
                    />
                  </label>
                </div>
                <div className='new-booking-datetime-element'>
                  <label className='new-booking-form-datetime-element-label'>
                    Время окончания:
                    <input
                        placeholder=''
                        type='time'
                        onChange={(e) => {
                          // setUsername(e.target.value)
                        }}
                    />
                  </label>
                </div>
                <div className='new-booking-datetime-element'>
                  <label className='new-booking-form-datetime-element-label'>
                    Время окончания:
                    <input
                        placeholder=''
                        type='time'
                        onChange={(e) => {
                          // setUsername(e.target.value)
                        }}
                    />
                  </label>
                </div>
              </div>
          ) : null}

          <div className='new-booking-buttons-container'>
            <button
                type='button'
                className='new-booking-buttons-cancel'
                onClick={() => setNewBookingFormOpen(false)}
            >
              Отмена
            </button>
            <button
                type='submit'
                className='new-booking-buttons-accept'
                onClick={() => {
                  console.log('click accept');
                  setNewBookingFormOpen(false);
                }}
            >
              Забронировать
            </button>
          </div>
        </form>
      </div>
  );
};

export default NewBookingComponent;