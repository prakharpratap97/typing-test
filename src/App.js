import React, { useState, useEffect } from "react";
import "./style.css";

const RANDOM_QUOTE_API_URL = "https://api.quotable.io/random";

function App() {
  const [quote, setQuote] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [timer, setTimer] = useState(60);
  const [isTimeUp, setIsTimeUp] = useState(false);

  useEffect(() => {
    fetchQuote();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) {
        setTimer((prev) => prev - 1);
      } else {
        setIsTimeUp(true);
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const fetchQuote = async () => {
    const response = await fetch(RANDOM_QUOTE_API_URL);
    const data = await response.json();
    setQuote(data.content);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (timer === 60) {
      setTimer(59);
    }
  };

  const getAccuracy = () => {
    const quoteWords = quote.split(" ");
    const inputWords = inputValue.split(" ");
    let correctWords = 0;
    for (let i = 0; i < quoteWords.length; i++) {
      if (quoteWords[i] === inputWords[i]) {
        correctWords++;
      }
    }
    return (correctWords / quoteWords.length) * 100;
  };

  const getWordsPerMinute = () => {
    const inputWords = inputValue.trim().split(/\s+/);
    const minutes = 60 / (60 - timer);
    const wordsPerMinute = inputWords.length / minutes;
    return wordsPerMinute.toFixed(0);
  };

  const renderResults = () => {
    const accuracy = getAccuracy();
    const wordsPerMinute = getWordsPerMinute();
    const incorrectWords = quote
      .split(" ")
      .filter((word, index) => word !== inputValue.split(" ")[index])
      .join(" ");

    return (
      <div className="results">
        <h2>Results</h2>
        <p>Accuracy: {accuracy.toFixed(0)}%</p>
        <p>Words per minute: {wordsPerMinute}</p>
        {incorrectWords && <p>Incorrect words: {incorrectWords}</p>}
      </div>
    );
  };

  return (
    <div className="App">
      {isTimeUp ? (
        renderResults()
      ) : (
        <>
          <div className="timer">{timer}</div>
          <div className="Title">Typing speed</div>
          <div className="container">
            <div className="quote-display">
              {quote.split("").map((char, index) => {
                let color;
                if (index < inputValue.length) {
                  color = char === inputValue[index] ? "correct" : "incorrect";
                }
                return (
                  <span key={index} className={color}>
                    {char}
                  </span>
                );
              })}
            </div>
            <textarea
              id="quoteInput"
              className="quote-input"
              value={inputValue}
              onChange={handleInputChange}
              autoFocus
            />
          </div>
        </>
      )}
    </div>
  );
}

export default App;
