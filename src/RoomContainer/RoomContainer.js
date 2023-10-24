import React from 'react';
import './RoomContainer.css';

function getTime(date){
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return (`${hours}:${minutes}`);
}

const BookingRoomComponent = ({funcClickDiv, updateDataInfoBlock, name, bookings}) => {
    return (
        <div className="meeting-room">
            <h2>{name}</h2>
            <div className="booking-container">
                {bookings.map(booking => (
                    <div id={booking.id} key={booking.id} className="booking-card" onClick={() => {
                        booking['roomName'] = (name);
                        updateDataInfoBlock(booking);
                        funcClickDiv(booking.id);
                    }}>
                        <div>{booking.description}</div>
                        <div>{getTime(new Date(booking.startTime))} - {getTime(new Date(booking.endTime))}</div>
                        <div>{booking.username}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookingRoomComponent;
