import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const StyledNotificationContainer = styled.div`
  position: fixed;
  margin-top: 20px;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;
`;

const StyledNotificationMessage = styled.div`
  max-width: 500px;
  min-width: 300px;
  margin: 0 auto;
  background-color: ${({ messageType }) => (messageType === 'error' ? '#e54f4f' : '#fff')};
  color: ${({ messageType }) => (messageType === 'error' ? '#fff' : '#000')};
  padding: 10px;
  border-radius: 10px;
  animation: ${({ messageType }) => (messageType === 'error' ? slideIn : fadeIn)} 0.3s ease-in-out;
`;

const NotificationMessage = ({ message, setMessage, messageType }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      const timeout = setTimeout(() => {
        setIsVisible(false);
        setMessage(null);
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [message, setMessage]);

  return (
      isVisible && (
          <StyledNotificationContainer key={message}>
            <StyledNotificationMessage messageType={messageType}>
              {message}
            </StyledNotificationMessage>
          </StyledNotificationContainer>
      )
  );
};

export default NotificationMessage;