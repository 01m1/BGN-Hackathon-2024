import { useEffect, useState, useRef } from "react";
import Slide from "./Slide";
import addSlides from "./Slides"; 
import './css/App.css';

function App() {
  const [slides, setSlides] = useState([]);
  const containerRef = useRef(null);
  const [slideCount, setSlideCount] = useState(0); 

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
        handleNextSlide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleNextSlide = () => {
    const container = containerRef.current;
    const slideHeight = container.clientHeight; 

    container.scrollTo({
        top: container.scrollTop + slideHeight,
        behavior: "smooth",
    });

    const currentSlideIndex = Math.floor(container.scrollTop / slideHeight);

    if (currentSlideIndex === slideCount - 2) {
        addMoreSlides(); 
    }
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
