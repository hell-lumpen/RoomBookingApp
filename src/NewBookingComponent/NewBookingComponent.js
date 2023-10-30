import './NewBookingComponent.css'
import React, {useEffect, useState} from "react";
import axios from "axios";


const NewBookingComponent = ({call_function}) => {
  const [audiences, setAudiences] = useState([]);

  useEffect(() => {
    getAudience()
  }, []);


  const formatDate = (d) => {
    const padWithZero = (number) => String(number).padStart(2, '0');
    const year = d.getFullYear();
    const month = padWithZero(d.getMonth() + 1);
    const day = padWithZero(d.getDate());
    const hour = padWithZero(d.getHours());
    const minute = padWithZero(d.getMinutes());
    return `${year}-${month}-${day}T${hour}:${minute}:00`;
  };
  const getAudience = () => {
    const token = localStorage.getItem('token');

    const headers = {
      Authorization: 'Bearer ' + token,
    };
    axios.get(
        `http://${process.env.REACT_APP_API_DEV_HOST}:${process.env.REACT_APP_API_DEV_PORT}/api/room/all`,
        {headers}
    ).then(
        (response) => {
          const new_array = [];
          console.log(response.data);
          response.data.forEach((id, name) => {
            new_array.push({
              "id": id.id,
              "name": id.name
            });
          })

          setAudiences(new_array);
        }
    );
  }

  const acceptBtnClick = () => {

    const audience = document.getElementById('select-audience').value;
    const date = document.getElementById('book-date').value;
    const start_time = document.getElementById('book-start-time').value;
    const end_time = document.getElementById('book-end-time').value;
    const description = document.getElementById('book-description').value;
    if (audience !== 'default' && date !== '' && start_time !== '' && end_time !== '' && description !== '') {
      // console.log('a', audience);
      // console.log('a', date);
      // console.log('a', start_time);
      // console.log('a', end_time);
      // console.log('a', description);
      const token = localStorage.getItem("token");
      const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': `http://${process.env.REACT_APP_API_DEV_HOST}:${process.env.REACT_APP_API_DEV_PORT}`,
        Authorization: 'Bearer ' + token
      };

      let dateParts = date.split('-'); // Разбиваем строку на части
      let year = parseInt(dateParts[0], 10);
      let month = parseInt(dateParts[1], 10) - 1; // Месяцы в JavaScript начинаются с 0 (январь - 0, февраль - 1, и так далее)
      let day = parseInt(dateParts[2], 10);

      const start_date = new Date(year, month, day);
      const end_date = new Date(start_date);


      dateParts = start_time.split(':');
      start_date.setHours(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10), 0);
      dateParts = end_time.split(':');
      end_date.setHours(parseInt(dateParts[0], 10), parseInt(dateParts[1], 10), 0);

      console.log('start', start_date);
      console.log('end', start_date);


      const roomId = audience;
      console.log(roomId);
      const userId = 1;
      const startTime = formatDate(start_date);
      const endTime = formatDate(end_date);
      const rRule = null;

      console.log('start', startTime);
      console.log('end', endTime);

      axios.post(
          `http://${process.env.REACT_APP_API_DEV_HOST}:${process.env.REACT_APP_API_DEV_PORT}/api/bookings`,
          {
            // id,
            roomId,
            userId,
            startTime,
            endTime,
            description,
            rRule
          },
          {headers},
      )


    }
  }

  return (

      <div className='new-booking-block-window' id='new-booking-block-window' onClick={(event) => {
        event.stopPropagation();
      }}>
        <div className='new-booking-block-window-container'>

          <div className='info-block'>
            <strong className='title'>Аудитория:</strong>
            <select id="select-audience">
              <option value='default'>...</option>
              {audiences.map((element, index) => {
                return <option key={element.id} value={element.id}>{element.name}</option>
              })}
            </select>
          </div>

          <div id='date-block' className='info-block'>
            <strong className='title'>Дата:</strong>
            <input id='book-date' type='date'/>

          </div>

          <div id='date-block' className='info-block'>
            <strong className='title'>Время начала:</strong>
            <input id='book-start-time' type='time'/>
          </div>


          <div id='date-block' className='info-block'>
            <strong className='title'>Время конца:</strong>
            <input id='book-end-time' type='time'/>
          </div>

          <div id='date-block' className='info-block'>
            <strong className='title'>Описание:</strong>
            <input id='book-description' type='text'/>
          </div>
          <div>


          </div>

        </div>
        <div className='new-booking-buttons-container'>
          <button className='new-booking-buttons-cancel' onClick={() => {
            console.log('click cancel');
            call_function(true)
          }}>Отмена
          </button>
          <button className='new-booking-buttons-accept' onClick={() => {
            console.log('click accept');
            acceptBtnClick();
            call_function(true);
          }}>Бронировать
          </button>
        </div>
      </div>


  );

}


export default NewBookingComponent;