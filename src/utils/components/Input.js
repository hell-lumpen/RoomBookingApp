import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';


const StyledInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 10px;
  padding-right: 30px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 11px;
  font-size: 16px;
  -webkit-appearance: none;
  appearance: none;

  &:focus {
    outline: none;
    border-color: #0095DA;
  }

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const ClearButton = styled.button`
  position: absolute;
  top: 50%;
  right: 0;
  margin: 0;
  padding: 10px;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 20px;
  color: #999;
  vertical-align: center;

  @media (min-width: 600px) {
    font-size: 28px;
  }
`;

/**
 * Компонент ввода для использования в React-приложении.
 *
 * @component
 * @example
 * // Пример использования компонента Input:
 * <Input
 *   placeholder="Введите текст"
 *   type="text"
 *   inputValueState={[inputValue, setInputValue]}
 *   onChange={(e) => handleInputChange(e)}
 *   showClearButton={true}
 *   validate={(value) => isValid(value)}
 * />
 *
 * @param {Object} props - Свойства компонента.
 * @param {string} props.placeholder - Текст для отображения внутри поля ввода в качестве подсказки.
 * @param {string} props.type - Тип ввода (например, "text", "password").
 * @param {Array} props.inputValueState - Состояние значения ввода в формате [value, setValue].
 * @param {Function} props.onChange - Обработчик события изменения значения ввода.
 * @param {boolean} props.showClearButton - Флаг для отображения кнопки очистки.
 * @param {Function} props.validate - Функция для валидации введенного значения.
 * @returns {JSX.Element} Компонент Input.
 */
const Input = ({ placeholder, type, inputValueState = ['', () => {}], onChange, showClearButton, validate }) => {
  const [inputValue, setInputValue] = inputValueState;
  const [isValid, setValid] = useState(true);

  const handleClearClick = () => {
    setInputValue('');
  };

  return (
      <StyledInputContainer>
        <StyledInput
            placeholder={placeholder}
            type={type}
            value={inputValue}
            onChange={(e) => {
              onChange(e);
              setValid(validate(inputValue))
            }}
            style={{ borderColor: isValid ? '#0095DA' : 'red' }}
        />
        {showClearButton && (
            <ClearButton onClick={handleClearClick}>&times;</ClearButton>
        )}
      </StyledInputContainer>
  );
};

Input.propTypes = {
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  inputValueState: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  showClearButton: PropTypes.bool,
  validate: PropTypes.func.isRequired,
};

export default Input;