import logging
import json
import os

from flask import Flask, abort, jsonify, render_template, request, send_from_directory
from flask_cors import CORS
from google import genai
from google.genai import types


app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024
logging.basicConfig(level=logging.INFO)
SITE_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        "TUTOR_ALLOWED_ORIGINS",
        "http://localhost:5500,http://127.0.0.1:5500,https://parthivcbn.github.io",
    ).split(",")
    if origin.strip()
]
CORS(app, resources={r"/tutor": {"origins": ALLOWED_ORIGINS}})

SYSTEM_INSTRUCTION = """
You are an intelligent, helpful, and friendly AI collaborator.
Provide clear, direct, and well-formatted answers. Use markdown where helpful.
""".strip()

TUTOR_INSTRUCTION = """
You are a kind, encouraging AI tutor for students in grades 4 through 7.
Explain the student's question in age-appropriate language, using short clear steps.
Help them understand rather than just giving an answer. Be accurate and supportive.
Create one small four-choice practice question that checks the same idea.
Return only JSON matching the requested schema. Keep explanations concise.
""".strip()

TUTOR_RESPONSE_SCHEMA = {
    "type": "OBJECT",
    "properties": {
        "topic": {"type": "STRING"},
        "explanation": {"type": "STRING"},
        "example": {"type": "STRING"},
        "game": {
            "type": "OBJECT",
            "properties": {
                "prompt": {"type": "STRING"},
                "options": {"type": "ARRAY", "items": {"type": "STRING"}},
                "correctIndex": {"type": "INTEGER"},
                "feedback": {"type": "STRING"},
            },
            "required": ["prompt", "options", "correctIndex", "feedback"],
        },
    },
    "required": ["topic", "explanation", "example", "game"],
}


@app.get("/")
def home():
    return render_template("index.html")


@app.post("/chat")
def chat():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "Please send a JSON request."}), 400

    user_message = payload.get("message")
    if not isinstance(user_message, str) or not user_message.strip():
        return jsonify({"error": "Enter a message before sending."}), 400
    user_message = user_message.strip()
    if len(user_message) > 4000:
        return jsonify({"error": "Messages must be 4,000 characters or fewer."}), 400

    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return jsonify({"error": "The assistant is not configured yet. Set GEMINI_API_KEY on the server."}), 503

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_message,
            config=types.GenerateContentConfig(system_instruction=SYSTEM_INSTRUCTION),
        )
    except Exception:
        app.logger.exception("Gemini request failed")
        return jsonify({"error": "The assistant could not respond right now. Please try again."}), 502

    answer = response.text
    if not answer:
        return jsonify({"error": "The assistant returned an empty response. Please try again."}), 502
    return jsonify({"response": answer})


@app.post("/tutor")
def tutor():
    payload = request.get_json(silent=True)
    if not isinstance(payload, dict):
        return jsonify({"error": "Please send a JSON request."}), 400

    question = payload.get("question")
    if not isinstance(question, str) or not question.strip():
        return jsonify({"error": "Type a question so the tutor can help."}), 400
    question = question.strip()
    if len(question) > 4000:
        return jsonify({"error": "Questions must be 4,000 characters or fewer."}), 400

    grade = str(payload.get("grade", "4-7"))[:30]
    subject = str(payload.get("subject", "general learning"))[:60]
    context = payload.get("context", "")
    if not isinstance(context, str):
        context = ""
    context = context[:1000]
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return jsonify({"error": "The tutor is not configured yet. Set GEMINI_API_KEY on the server."}), 503

    prompt = f"Student grade: {grade}. Subject: {subject}. Current lesson context: {context or 'none provided'}. Student question: {question}"
    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=TUTOR_INSTRUCTION,
                response_mime_type="application/json",
                response_schema=TUTOR_RESPONSE_SCHEMA,
            ),
        )
        result = json.loads(response.text or "")
        if not isinstance(result, dict):
            raise ValueError("Gemini returned an invalid tutor response")
        game = result.get("game", {})
        if (
            not all(isinstance(result.get(key), str) and result[key].strip() for key in ("topic", "explanation", "example"))
            or not isinstance(game, dict)
            or not isinstance(game.get("options"), list)
            or len(game["options"]) != 4
            or not all(isinstance(option, str) for option in game["options"])
            or not isinstance(game.get("correctIndex"), int)
            or isinstance(game.get("correctIndex"), bool)
            or not 0 <= game["correctIndex"] < 4
            or not all(isinstance(game.get(key), str) and game[key].strip() for key in ("prompt", "feedback"))
        ):
            raise ValueError("Gemini returned an invalid tutor response")
    except Exception:
        app.logger.exception("Gemini tutor request failed")
        return jsonify({"error": "The tutor could not answer right now. Please try again."}), 502

    return jsonify(result)


@app.get("/<path:filename>")
def site_file(filename):
    allowed_extensions = {".html", ".js", ".css", ".svg", ".png", ".jpg", ".jpeg", ".webp", ".ico"}
    path_parts = filename.split("/")
    extension = os.path.splitext(filename)[1].lower()
    if any(part.startswith(".") or part == "gemini-assistant" for part in path_parts) or extension not in allowed_extensions:
        abort(404)
    return send_from_directory(SITE_ROOT, filename)


if __name__ == "__main__":
    app.run(port=5000)