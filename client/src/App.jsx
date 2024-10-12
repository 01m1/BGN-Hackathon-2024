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

  useEffect(() => {
    // Add event listener for keydown
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
    const slideHeight = container.clientHeight; // Use the container's height to calculate scroll

    // Get the current scroll position and calculate the next position
    const currentScrollPosition = container.scrollTop;
    const maxScrollPosition = container.scrollHeight - slideHeight;

    // Scroll to the next slide, if not already at the bottom
    if (currentScrollPosition < maxScrollPosition) {
      container.scrollTo({
        top: currentScrollPosition + slideHeight,
        behavior: "smooth",
      });
    }
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
            onNextSlide={() => handleNextSlide()} // Move to next slide on action
          />
        ))}
      </div>
    </div>
  );
}

export default App;
