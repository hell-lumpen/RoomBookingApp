import React, { useState, useEffect } from 'react';
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

const SuggestionsContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  border: 1px solid #ccc;
  border-top: none;
  border-radius: 0 0 11px 11px;
  background-color: #fff;
  z-index: 1;
`;

const SuggestionItem = styled.div`
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #f2f2f2;
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

const AutocompleteInput = ({
                             placeholder,
                             type,
                             inputValueState = ['', () => {}],
                             onChange,
                             showClearButton,
                             validate,
                             fetchSuggestions,
                             onSelect
                           }) => {
  const [inputValue, setInputValue] = inputValueState;
  const [isValid, setValid] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleClearClick = () => {
    setInputValue('');
  };

  const handleSelectItem = (item) => {
    setInputValue('');
    setSuggestions([]);
    setValid(true)
    setSelectedItem(item);
    onSelect(item);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchSuggestions(inputValue);
        setSuggestions(result);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    if (inputValue && inputValue.length >= 3) {
      fetchData();
    } else {
      setSuggestions([]);
    }
  }, [inputValue, fetchSuggestions]);

  return (
      <StyledInputContainer>
        <StyledInput
            placeholder={placeholder}
            type={type}
            value={inputValue}
            onChange={(e) => {
              onChange(e);
              setValid(validate(inputValue));
            }}
            style={{ borderColor: isValid ? '#0095DA' : 'red' }}
        />
        {showClearButton && (
            <ClearButton onClick={handleClearClick}>&times;</ClearButton>
        )}
        {suggestions.length > 0 && (
            <SuggestionsContainer>
              {suggestions.map((suggestion) => (
                  <SuggestionItem
                      key={suggestion.id}
                      onClick={() => handleSelectItem(suggestion)} // Изменение обработчика для передачи выбранного объекта
                  >
                    {suggestion.value}
                  </SuggestionItem>
              ))}
            </SuggestionsContainer>
        )}
      </StyledInputContainer>
  );
};

AutocompleteInput.propTypes = {
  placeholder: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  inputValueState: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  showClearButton: PropTypes.bool,
  validate: PropTypes.func.isRequired,
  fetchSuggestions: PropTypes.func.isRequired,
};

export default AutocompleteInput;