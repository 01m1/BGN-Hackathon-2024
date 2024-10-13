from flask import Flask, request, jsonify  
from flask_cors import CORS
import google.generativeai as genai  
import json

highestStreak = 0
totalAnswered = 0
totalCorrect = 0
totalSpeed = 0

app = Flask(__name__)
CORS(app)

# Configure your API key here
genai.configure(api_key="AIzaSyDtbKx-25i0t8YfQGszgeCy-1mrI1Sj0b4")

# Sample data for personal bests and achievements
personal_bests = {
    "best_time": "10:30",
    "best_score": 100,
}

achievements = [
    {"title": "First Login", "achieved": True},
    {"title": "Completed 10 Quizzes", "achieved": False},
]

# Create the model
generation_config = {
    "temperature": 1,
    "top_p": 0.95,
    "top_k": 64,
    "max_output_tokens": 8192,
    "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config=generation_config,
    system_instruction="When asked to generate questions, generate factorisable quadratics and their solutions when equal to zero in a json format of the form {'a':a,'b':b,'c':c, 'sol1': e, 'sol2': f, 'fakesol':g} to represent a quadratic of ax^2+bx + c with solutions e and f, where they are all integers. Vary the a value as an integer up to 10 and keep the questions reasonable for a 12-13 year old. FakeSol is a random incorrect answer",
)

@app.route('/api/questions/<int:numQuestions>', methods=['GET'])
def getQuestions(numQuestions):
    chat_session = model.start_chat(
        history=[
            {
                "role": "user",
                "parts": [
                    "When asked to generate questions, ensure they are easy enough for a 12-13 to do without a calculator and that any decimal answers are rounded to 1.dp",
                ],
            },
        ]
    )

    response = chat_session.send_message(f"Generate {numQuestions} Questions")
    json_string = response.text
    start_index = json_string.index('[', json_string.index('```'))
    end_index = json_string.index('```', start_index)
    json_data = json_string[start_index:end_index].strip()
    print(json_data)
    return json.loads(json_data), 200

@app.route('/api/gemSol/<int:a>/<int:b>/<int:c>', methods=['GET'])
def getGeminiSol(a, b, c):
    chat_session = model.start_chat(
        history=[
            {
                "role": "user",
                "parts": [
                    "When given a Quadratic of the form ax^2 + bx + c = 0, solve by factorising and provide a concise but clear step by step solution.",
                ],
            },
        ]
    )
    response = chat_session.send_message(f"Provide a step by step solution to solving this quadratic by factorising {a}x^2 + {b}x + {c}")
    
    formatted_response = response.text.replace('**', '\n')
    
    return formatted_response

@app.route('/api/profileStatistics', methods=['GET'])
def getProfileStatistics():
    return jsonify({'highestStreak': highestStreak, 'totalAnswered': totalAnswered, 'totalCorrect': totalCorrect, 'totalSpeed': totalSpeed})

@app.route('/api/updateStatistics', methods=['POST'])
def updateStatistics():
    global highestStreak, totalSpeed, totalCorrect, totalAnswered

    data = request.get_json()  # Expecting JSON data
    hS = data.get('streak')
    answered = data.get('answered')
    correct = data.get('correct')
    speed = data.get('speed')

    # Update statistics if the values are provided
    if hS is not None:
        if hS > highestStreak:
            highestStreak = hS

    if answered is not None:
        totalAnswered += answered

    if correct is not None:
        totalCorrect += correct

    if speed is not None:
        totalSpeed += speed

    return jsonify({'message': 'Statistics updated successfully'})

# Endpoint to fetch personal bests
@app.route('/api/personalBests', methods=['GET'])
def get_personal_bests():
    return jsonify(personal_bests), 200

# Endpoint to fetch achievements
@app.route('/api/achievements', methods=['GET'])
def get_achievements():
    return jsonify(achievements), 200

if __name__ == "__main__":
    app.run(debug=True, port=5001)  # Change port if necessary
