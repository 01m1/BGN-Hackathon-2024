from flask import Flask, request, jsonify
import google.generativeai as genai

highestStreak = 0
totalAnswered = 0
totalCorrect = 0
totalSpeed = 0

app = Flask(__name__)


genai.configure(api_key="AIzaSyDtbKx-25i0t8YfQGszgeCy-1mrI1Sj0b4")



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
  # safety_settings = Adjust safety settings
  # See https://ai.google.dev/gemini-api/docs/safety-settings
  system_instruction="When asked to generate questions, generate factorisable quadratics and their solutions when equal to zero in a json format of the form {'a':a:'b':b,'c':c, 'sol1': e, 'sol2': f, 'fakesol':g} to represent a quadratic of ax^2+bx + c with solutions e and f, where they are all integers. Vary the a value as an integer up to 10 and keep the questions reasonable for a 12-13 year old. FakeSol is a random incorrect answer",
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

    return (response.text)

@app.route('/api/gemSol/<int:a>/<int:b>/<int:c>', methods=['GET'])
def getGeminiSol(a,b,c):
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
    response = response = chat_session.send_message(f"Provide a step by step solution to solving this quadratic by factorising {a}x^2 + {b}x + {c}")
    return response.text

@app.route('/api/profileStatistics', methods=['GET'])
def getProfileStatistics():
    return jsonify({'highestStreak':highestStreak, 'totalAnswered':totalAnswered, 'totalCorrect':totalCorrect, 'totalSpeed': totalSpeed})

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

if __name__ == "__main__":
    app.run(debug=True)






