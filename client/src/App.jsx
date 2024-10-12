import { useEffect, useState, useRef } from "react";
import Slide from "./Slide";
import addSlides from "./Slides";
import './css/App.css';

function App() {
  const [slides, setSlides] = useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    setSlides(addSlides);
  }, []);

  const handleNextSlide = (index) => {
    const container = containerRef.current;
    const slideHeight = container.clientHeight;

    container.scrollTo({
      top: (index + 1) * slideHeight,
      behavior: "smooth",
    });
  };

  return (
    <div className="main" ref={containerRef}>
      <div className="main_video">
        {slides.map((slide, index) => (
          <Slide
            a={slide.a}
            b={slide.b}
            c={slide.c}
            sol1={slide.sol1}
            sol2={slide.sol2} 
            onNextSlide={() => handleNextSlide(index)} 
          />
        ))}
      </div>
    </div>
  );
}

export default App;
