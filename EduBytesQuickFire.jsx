import React, { useState, useEffect } from "react";
import "./EduBytesQuickFire.css"; //

function EduBytesQuickFire() {
  const [equation, setEquation] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [roots, setRoots] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timer
  const [isActive, setIsActive] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0); // Score tracking
  const [fakeSolution, setFakeSolution] = useState(null); // Keep track of the fake solution

  // Start game logic
  const startGame = () => {
    setScore(0); // Reset score
    setTimeLeft(60); // Reset timer
    setIsActive(true); // Start timer
    generateQuadraticEquation(); // Generate the first equation
  };

  const generateQuadraticEquation = () => {
    // Randomly generate two distinct positive integers as roots
    const r1 = getRandomInt(1, 5);
    let r2;
    do {
      r2 = getRandomInt(1, 5);
    } while (r1 === r2); // Ensure r2 is different from r1

    const a = 1; // Coefficient a for simplicity
    const b = -(r1 + r2); // b is negative of the sum of roots
    const c = r1 * r2; // c is the product of the roots

    // Ensure the equation is displayed in positive format
    const equationString = `${a}x² + ${Math.abs(b)}x + ${c} = 0`;
    setEquation(equationString);
    calculateRoots(a, b, c);
    setSelectedAnswer(""); // Reset selected answer
    setFeedback(""); // Reset feedback
  };

  const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min; // Generate a random integer within the range
  };

  const calculateRoots = (a, b, c) => {
    const discriminant = b * b - 4 * a * c;
    let rootsArray = [];

    if (discriminant >= 0) {
      const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      rootsArray = [root1.toFixed(0), root2.toFixed(0)].map(Number);
    } else {
      return; // Skip if roots are not real
    }

    // Add a fake solution, ensuring it's not one of the real roots
    let fakeSolution;
    do {
      fakeSolution = getRandomInt(1, 10); // Generate a positive fake solution
    } while (rootsArray.includes(fakeSolution)); // Ensure it's not one of the real roots

    const options = [...rootsArray, fakeSolution].sort(
      () => Math.random() - 0.5
    );
    setRoots(options);
    setFakeSolution(fakeSolution); // Store the fake solution for comparison later
  };

  const handleSelect = (option) => {
    setSelectedAnswer(option);
    setIsActive(false); // Stop timer when an answer is selected

    // Check if the selected option is the fake solution
    if (option === fakeSolution) {
      setFeedback("Correct! ✅"); // Fake solution is correct
      setScore((prevScore) => prevScore + 1);
    } else {
      setFeedback("Wrong! ❌"); // Real solutions are incorrect
    }

    setTimeout(() => {
      generateQuadraticEquation(); // Generate a new question
      setIsActive(true); // Reactivate the timer
    }, 1000);
  };

  useEffect(() => {
    let timer;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false); // Stop the timer when it reaches 0
      alert(`Time's up! Your score is: ${score}`);
      resetGame(); // Reset game state and restart
    }
    return () => clearInterval(timer); // Cleanup
  }, [isActive, timeLeft]);

  const resetGame = () => {
    setEquation(""); // Clear the equation
    setRoots([]); // Clear roots
    setFeedback(""); // Clear feedback
    setScore(0); // Reset score
    setSelectedAnswer(""); // Clear selected answer
    setTimeLeft(60); // Reset timer
    startGame(); // Automatically restart the game
  };

  // Automatically start the game when the component mounts
  useEffect(() => {
    startGame(); // Start game on load
  }, []);

  return (
    <div className="App">
      <h1>EduBytes Quickfire Mode</h1>
      <h2>Time Left: {timeLeft} seconds</h2>
      {equation && (
        <>
          <h2>Generated Equation:</h2>
          <p>{equation}</p>
          <h3>Choose the incorrect solution:</h3>
          {roots.map((option, index) => (
            <button key={index} onClick={() => handleSelect(option)}>
              {option}
            </button>
          ))}
          {selectedAnswer && (
            <p>
              You selected: {selectedAnswer} - {feedback}
            </p>
          )}
          <div className="timer-container">
            <div
              className="progress-bar"
              style={{
                height: "10px",
                width: `${(timeLeft / 60) * 100}%`,
                backgroundColor: "#6200ea",
                transition: "width 1s linear",
              }}
            ></div>
          </div>
        </>
      )}
    </div>
  );
}

export default EduBytesQuickFire; //
