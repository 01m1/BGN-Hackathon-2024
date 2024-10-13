const requestData = async () => {
    try {
        const response = await fetch('http://localhost:5000/api/questions/10', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data; 
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
};

const addSlides = async () => {
    const slides = await requestData();
    return slides.length > 0 ? slides : [
        {
          "a": 1,
          "b": 5,
          "c": 6,
          "fakesol": 1,
          "sol1": -2,
          "sol2": -3
        },
        {
          "a": 2,
          "b": 7,
          "c": 3,
          "fakesol": 2,
          "sol1": -3,
          "sol2": -0.5
        },
        {
          "a": 3,
          "b": 8,
          "c": 5,
          "fakesol": 3,
          "sol1": -1,
          "sol2": -1.6
        },
        {
          "a": 4,
          "b": 11,
          "c": 6,
          "fakesol": 4,
          "sol1": -1.5,
          "sol2": -1
        },
        {
          "a": 5,
          "b": 14,
          "c": 8,
          "fakesol": 5,
          "sol1": -2,
          "sol2": -0.8
        },
        {
          "a": 6,
          "b": 17,
          "c": 10,
          "fakesol": 6,
          "sol1": -1,
          "sol2": -1.6
        },
        {
          "a": 7,
          "b": 20,
          "c": 12,
          "fakesol": 7,
          "sol1": -1.2,
          "sol2": -1.4
        },
        {
          "a": 8,
          "b": 23,
          "c": 14,
          "fakesol": 8,
          "sol1": -1,
          "sol2": -1.7
        },
        {
          "a": 9,
          "b": 26,
          "c": 16,
          "fakesol": 9,
          "sol1": -1.1,
          "sol2": -1.6
        },
        {
          "a": 10,
          "b": 29,
          "c": 18,
          "fakesol": 10,
          "sol1": -0.9,
          "sol2": -2
        }
    ]
};
export default addSlides;
