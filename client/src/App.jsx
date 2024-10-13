import { useEffect, useState, useRef } from "react";
import Slide from "./Slide";
import addSlides from "./Slides"; 
import './css/App.css';

function App() {
  const [slides, setSlides] = useState([]);
  const containerRef = useRef(null);
  const [slideCount, setSlideCount] = useState(0);
  const [streakk, setStreak] = useState(1);
  const [incorrect, setIncorrect] = useState(0);
  const [correct, setCorrect] = useState(0);

  useEffect(() => {
    const loadSlides = async () => {
      const initialSlides = await addSlides();
      setSlides(initialSlides);
      setSlideCount(initialSlides.length);
    };
    loadSlides(); 
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown") {
        handleNextSlide;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const updateInfo = async (streak, correct, incorrect) => {
    try {
        const response = await fetch('http://localhost:5000/api/updateStatistics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                streak: streak, // current streak
                correct: correct, // total correct answers
                answered: correct + incorrect // total answers
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        console.log('Statistics updated successfully!');
        
    } catch (error) {
        console.error('Error:', error);
    }
  };


  const handleNextSlide = (streak) => {
    const container = containerRef.current;
    const slideHeight = container.clientHeight; 
    if (streak == 0) {
      setStreak(0);
      setIncorrect(incorrect + 1);
    } else {
      setStreak(streakk + streak);
      setCorrect(correct + 1);
    }

    console.log("!!!", streakk);

    container.scrollTo({
        top: container.scrollTop + slideHeight,
        behavior: "smooth",
    });

    const currentSlideIndex = Math.floor(container.scrollTop / slideHeight);

    if (currentSlideIndex === slideCount - 2) {
      addMoreSlides(); 
    }

    updateInfo();
  };


  const addMoreSlides = async () => {
    const newSlides = await addSlides();
    setSlides((prevSlides) => [...prevSlides, ...newSlides]);
    setSlideCount((prevCount) => prevCount + newSlides.length); 
  };

  return (
    <div className="main" ref={containerRef}>
      <div className="main_video">
        {slides.map((slide, index) => (
          <Slide
            key={index}
            a={slide.a}
            b={slide.b}
            c={slide.c}
            sol1={slide.sol1}
            sol2={slide.sol2}
            fakesol={slide.fakesol}
            onNextSlide={handleNextSlide}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
