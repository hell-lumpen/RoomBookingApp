import './NewBookingComponent.css'
import React, {useEffect} from "react";
import axios from "axios";


const NewBookingComponent = ({call_function}) => {
    const audiences = [
        'It - 5',
        'It - 6',
        'It - 7',
        'It - 8',
        'It - 9',
        'It - 10',
        'It - 11',
        'It - 12',
        'It - 13',
        'It - 14',
        'It - 15',
        'It - 16',
        'It - 17'
    ];

    useEffect(() => {
        getAudience()
    }, []);
    const getAudience=()=>{
        const token = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VybmFtZTEiLCJpYXQiOjE2OTgwNzEzMzEsImV4cCI6MTY5ODY3NjEzMX0.trcNRuEYO7iQIJ-GWvA-ezDen6QKJG2AWwiwsnOBxjI';
        const headers = {
            Authorization: 'Bearer ' + token,
        }
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
    }

    const acceptBtnClick = () => {

        const audience = document.getElementById('select-audience').value;
        const date = document.getElementById('book-date').value;
        const start_time = document.getElementById('book-start-time').value;
        const end_time = document.getElementById('book-end-time').value;
        const description = document.getElementById('book-description').value;
        if (audience !== 'default' && date !== '' && start_time !== '' && end_time !== '' && description !== '') {
            console.log('a', audience);
            console.log('a', date);
            console.log('a', start_time);
            console.log('a', end_time);
            console.log('a', description);
        }
    }

    return (

        <div className='new-booking-block-window' id='new-booking-block-window'>
            <div className='new-booking-block-window-container'>

                <div className='info-block'>
                    <strong className='title'>Аудитория:</strong>
                    <select id="select-audience">
                        <option value='default'>...</option>
                        {audiences.map((element) => {
                            return <option value={element}>{element}</option>
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
                <button className='new-booking-buttons-cancel' onClick={()=>{call_function(true)}}>Отмена</button>
                <button className='new-booking-buttons-accept' >Бронировать</button>
            </div>
        </div>


    );

}


export default NewBookingComponent;