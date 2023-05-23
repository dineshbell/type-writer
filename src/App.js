import React, { useState, useEffect } from 'react';

const KEYBOARD_KEYS = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';'];

function App() {
  const [inputText, setInputText] = useState('');
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  const [keysPressed, setKeysPressed] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);

  useEffect(() => {
    if (currentKeyIndex === 0) {
      setStartTime(Date.now());
    }

    if (currentKeyIndex === KEYBOARD_KEYS.length) {
      setEndTime(Date.now());
    }

    const handleKeyPress = (event) => {
      const { key } = event;

      if (key === KEYBOARD_KEYS[currentKeyIndex]) {
        setKeysPressed((prevKeysPressed) => prevKeysPressed + 1);
        setCurrentKeyIndex((prevKeyIndex) => prevKeyIndex + 1);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [currentKeyIndex]);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
    calculateAccuracy(event.target.value);
  };

  const calculateAccuracy = (typedText) => {
    const targetText = KEYBOARD_KEYS.slice(0, typedText.length).join('');
    const errors = [...typedText].reduce(
      (acc, char, index) => acc + (char !== targetText[index] ? 1 : 0),
      0
    );

    setAccuracy(((typedText.length - errors) / typedText.length) * 100);
  };

  const renderNextKey = () => {
    if (currentKeyIndex < KEYBOARD_KEYS.length) {
      return <span className="next-key">{KEYBOARD_KEYS[currentKeyIndex]}</span>;
    }

    return null;
  };

  const renderTimer = () => {
    if (endTime > startTime) {
      const elapsedTime = (endTime - startTime) / 1000;
      const keysPerMinute = Math.round((keysPressed / elapsedTime) * 60);
      return (
        <div className="timer">
          <span>Time: {Math.round(elapsedTime)}s</span>
          <span> Keys per Minute: {keysPerMinute}</span>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="App">
      <div>
      <h1><span className='type-color'>Chabbi</span> Typing Practice</h1>
      <p>Type the following keys:</p>
      <div className="keyboard">
        {KEYBOARD_KEYS.map((key, index) => (
          <span className={index < currentKeyIndex ? 'typed-key' : 'untyped-key'} key={index}>
            {key}
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        autoFocus
        autoComplete="off"
      />
      {renderNextKey()}
      {renderTimer()}
      <div className="accuracy">Accuracy: {accuracy}%</div>
      </div>
    </div>
  );
}

export default App;
