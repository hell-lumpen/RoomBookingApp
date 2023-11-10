import React, { useState, useEffect } from 'react';
import './InfoMessageComponent.css'

const InfoMessageComponent = ({ message, setMessage}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setMessage(null)
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
      isVisible && (
          <div key={message} className="info-message-container">
            <div className="info-message">
              {message}
            </div>
          </div>
      )
  );
};

export default InfoMessageComponent;