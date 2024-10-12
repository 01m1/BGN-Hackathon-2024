import React, { useState, useEffect } from "react";
import './css/Slide.css';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';

function Slide({ a, b, c, onNextSlide }) {
    const correctAnswer = a;
    const wrongAnswer1 = b;
    const wrongAnswer2 = c;

    const options = [correctAnswer, wrongAnswer1, wrongAnswer2];

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [submitted, setSubmitted] = useState(false);

    // Reset states when the component mounts or when a new question is loaded
    useEffect(() => {
        setSelectedAnswer(null);
        setSubmitted(false);
    }, [a, b, c]); // Dependencies for new question values

    const handleKeyPress = (event) => {
        if (submitted) return; // Do not process key presses if already submitted
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
                        className={`optionButton ${submitted ? (option === correctAnswer ? 'correct' : 'incorrect') : ''}`} 
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
                <p className={`feedback ${selectedAnswer === correctAnswer ? 'correct' : 'incorrect'}`}>
                    {selectedAnswer === correctAnswer ? 'Correct!' : 'Incorrect!'}
                </p>
            )}
            <ArrowDownwardIcon
                style={{ fontSize: 60, color: 'white' }} 
                className="arrow"
                onClick={onNextSlide} 
            />
        </div>
    );
}

export default Slide;
