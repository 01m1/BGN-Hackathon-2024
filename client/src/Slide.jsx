import React, { useState, useEffect } from "react";
import './css/Slide.css';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

function Slide({ a, b, c, sol1, sol2, fakesol, onNextSlide }) {
    const wrongAnswer = fakesol;
    const correctAnswer1 = sol1;
    const correctAnswer2 = sol2;

    const options = [wrongAnswer, correctAnswer1, correctAnswer2];

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [solution, setSolution] = useState(""); // State to store the solution

    useEffect(() => {
        resetStates();
    }, [a, b, c]);

    const resetStates = () => {
        setSelectedAnswer(null);
        setSubmitted(false);
        setSolution(""); // Reset solution when slide changes
    };

    const handleKeyPress = (event) => {
        if (submitted) return;
        switch (event.key) {
            case 'a':
                setSelectedAnswer(options[0]);
                handleSubmit();
                break;
            case 's':
                setSelectedAnswer(options[1]);
                handleSubmit();
                break;
            case 'd':
                setSelectedAnswer(options[2]);
                handleSubmit();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [submitted, options]);

    const handleSubmit = () => {
        setSubmitted(true);
    };

    const handleNextSlide = () => {
        resetStates();
        onNextSlide();
    };

    const handleGenerateSolution = async (a, b, c) => {
        try {
            const response = await fetch(`http://localhost:5000/api/gemSol/${a}/${b}/${c}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.text();
            console.log(data);

            setSolution(data.replace(/\n/g, "<br>"));
            
        } catch (error) {
            console.error('Error:', error);
            setSolution("Could not generate solution");
        }
    };

    return (
        <div className="slideContainer">
            <div className="slide">
                <h1 className="title">Solve for x</h1>
                <h1 className="equation">{a}x<sup>2</sup> + {b}x + {c} = 0</h1>
            </div>
            <div className="answers">
                {options.map((option, index) => (
                    <button 
                        key={index} 
                        className={`optionButton ${submitted ? (option === wrongAnswer ? 'incorrect' : 'correct') : ''}`} 
                        onClick={() => {
                            setSelectedAnswer(option);
                            if (submitted) return; 
                            handleSubmit();                  
                        }}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {submitted && (
                <p className={`feedback ${selectedAnswer === wrongAnswer ? 'incorrect' : 'correct'}`}>
                    {selectedAnswer === wrongAnswer ? 'Incorrect!' : 'Correct!'}
                </p>
            )}

            <div className="solutionButtonContainer">
                <button className="solButton" onClick={() => {handleGenerateSolution(a, b, c)}}>
                    Generate Solution
                </button>
            </div>

            {/* Display the solution with HTML rendering */}
            {solution && (
                <div className="solutionDisplay" dangerouslySetInnerHTML={{ __html: solution }} />
            )}

            <ArrowDownwardIcon
                style={{ fontSize: 60, color: 'white' }} 
                className="arrow"
                onClick={handleNextSlide} 
            />
        </div>
    );
}

export default Slide;
