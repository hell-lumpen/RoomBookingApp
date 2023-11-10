import React from 'react';
import './RoomContainer.css';
import { ReactComponent as SheduleSvg } from '../icons/schedule.svg'
import { ReactComponent as PersonSvg } from '../icons/person.svg'
import CustomInputParticipantComponent from "../CustomInputParticipant/CustomInputParticipantComponent";

function getTime(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return (`${hours}:${minutes}`);
}

const BookingRoomComponent = ({funcClickDiv, updateDataInfoBlock, name, bookings}) => {
    // console.log("name: " + name)
    const tag = 'Лекция';
    return (
        <div>
            {name ? (
                <div className="meeting-room">
                    <CustomInputParticipantComponent/>
                    <h2>{name}</h2>
                    <div className="booking-container">
                        {bookings.map(booking => (
                            <div id={booking.id} key={booking.id} className="booking-card" onClick={() => {
                                booking['roomName'] = (name);
                                updateDataInfoBlock(booking);
                                funcClickDiv(booking.id);
                            }}>
                                <div className='booking-time-tag-container'>
                                    <div className='booking-tag' id={'tag' + booking.id}>
                                        {tag}
                                    </div>

                                    <div className="icon-time-container">
                                        {/*<span className="material-icons icon">schedule</span>*/}
                                        <SheduleSvg className="icon-svg"/>
                                        {getTime(new Date(booking.startTime))} - {getTime(new Date(booking.endTime))}
                                    </div>
                                </div>
                                <div className="booking-info">Методы оптимизации</div>
                                {/*<div className="booking-info">{booking.description}</div>*/}

                                <div className="icon-text-container-person">
                                    <span className="material-icons icon">person</span>
                                    {booking.username}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    Бронирования на этот день отсутсвуют
                </div>
            )}
        </div>
    );
};

export default BookingRoomComponent;
