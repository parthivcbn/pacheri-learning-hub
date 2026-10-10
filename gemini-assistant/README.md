# Gemini AI Assistant

A Flask Gemini service for the learning hub, plus a standalone chat page with eight switchable themes. It can serve the existing static site locally so its quiz and tutor pages can use the same-origin Gemini endpoint.

## Setup

1. Create and activate a virtual environment in this directory.
2. Install dependencies with `python -m pip install -r requirements.txt`.
3. Set `GEMINI_API_KEY` in your shell using a key from Google AI Studio. Do not commit the key or put it in browser code.
4. Start the app with `python app.py`.
5. Open <http://127.0.0.1:5000/tutor.html> for the Gemini-powered tutor, <http://127.0.0.1:5000/index.html> for the quiz page, or <http://127.0.0.1:5000> for the standalone chat.

The development server binds to localhost and does not enable Flask debug mode. For a separate static-site host such as GitHub Pages, set the `tutor-api-url` meta tag in the page to the deployed backend's `/tutor` URL and set `TUTOR_ALLOWED_ORIGINS` on the backend to the site's origin. Deploy the Flask app behind a production WSGI server and HTTPS; never put the Gemini key in browser code.