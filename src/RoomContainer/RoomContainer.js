import React from 'react';
import './RoomContainer.css';

const BookingRoomComponent = ({ roomName, bookings }) => {
  return (
      <div className="meeting-room">
        <h2>{roomName}</h2>
        <div className="booking-container">
        {bookings.map(booking => (
            <div key={booking.id} className="booking-card">
              <div>{booking.bookingPurpose}</div>
              <div>{new Date(booking.startTime).toTimeString()} - {new Date(booking.endTime).toTimeString()}</div>
              <div>{booking.username}</div>
            </div>
        ))}
      </div>
      </div>
  );
};

export default BookingRoomComponent;
