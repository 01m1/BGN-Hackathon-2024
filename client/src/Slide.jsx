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

    // Reset states when the component mounts or when a new question is loaded
    useEffect(() => {
        setSelectedAnswer(null);
        setSubmitted(false);
    }, [a, b, c]);

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
                <button className="solButton">
                    Generate Solution
                </button>
            </div>
            <ArrowDownwardIcon
                style={{ fontSize: 60, color: 'white' }} 
                className="arrow"
                onClick={onNextSlide} 
            />
        </div>
    );
}

export default Slide;
