import React, { useState, useEffect } from "react";
import './css/Slide.css';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import Navbar from './Navbar';
import { MathJax, MathJaxContext } from 'better-react-mathjax';

function Slide({ a, b, c, sol1, sol2, fakesol, onNextSlide }) {
    const wrongAnswer = fakesol;
    const correctAnswer1 = sol1;
    const correctAnswer2 = sol2;

    const options = [wrongAnswer, correctAnswer1, correctAnswer2];

    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [solution, setSolution] = useState(""); // State to store the solution
    const [streak, setStreak] = useState(0);

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
        if (!submitted) {
            if (selectedAnswer !== wrongAnswer) {
                setStreak(1);
            } else {
                setStreak(0);
            }
        }

        setSubmitted(true);
    };

    const handleNextSlide = () => {
        resetStates();
        onNextSlide(streak);
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

            setSolution(data.replace(/\n/g, "<br>")); // Replace line breaks with HTML <br> tags
            
        } catch (error) {
            console.error('Error:', error);
            setSolution("Could not generate solution");
        }
    };

    return (
        <MathJaxContext>
        <body>
        <div>             
        <div>
            <Navbar />
        </div>
        <div className="slideContainer">

            <div className="slide">
            <h1 className="title">Find the incorrect solution</h1>
                <div className="equation">
                    <MathJax>{`\\(${a}x^2 + ${b}x + ${c} = 0\\)`}</MathJax>
                </div>
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
                        <MathJax>{`\\(${option}\\)`}</MathJax> {/* Render answers as LaTeX */}
                    </button>
                ))}
            </div>

            {submitted && (
                <p className={`feedback ${selectedAnswer === wrongAnswer ? 'incorrect' : 'correct'}`}>
                    <MathJax>{selectedAnswer === wrongAnswer ? 'Incorrect!' : 'Correct!'}</MathJax>
                </p>
            )}

            <div className="solutionButtonContainer">
                <button className="solButton" onClick={() => {handleGenerateSolution(a, b, c)}}>
                ✨ Generate Solution
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
        </div>
        </body>
        </MathJaxContext>
        
    );
}

export default Slide;
