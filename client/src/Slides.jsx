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
            a: 1,
            b: 5,
            c: 3,
            sol1: 2,
            sol2: 4,
            fakesol: 7,
        },
        {
            a: 1,
            b: 5,
            c: 3,
            sol1: 2,
            sol2: 4,
            fakesol: 7,
        },
        {
            a: 1,
            b: 5,
            c: 3,
            sol1: 2,
            sol2: 4,
            fakesol: 7,
        },
        {
            a: 1,
            b: 5,
            c: 3,
            sol1: 2,
            sol2: 4,
            fakesol: 7,
        },
        {
            a: 1,
            b: 5,
            c: 3,
            sol1: 2,
            sol2: 4,
            fakesol: 7,
        },
        {
            a: 1,
            b: 5,
            c: 3,
            sol1: 2,
            sol2: 4,
            fakesol: 7,
        },
    ];
};

export default addSlides;
