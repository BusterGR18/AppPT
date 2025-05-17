from flask import Flask, request, jsonify
from mailjet_rest import Client
from dotenv import load_dotenv
import os

# Load environment variables from .env
load_dotenv()

app = Flask(__name__)

MAILJET_API_KEY = os.environ.get("MAILJET_API_KEY")
MAILJET_API_SECRET = os.environ.get("MAILJET_API_SECRET")
SENDER_EMAIL = os.environ.get("SENDER_EMAIL", "noreply@sinomotos.site")
SENDER_NAME = os.environ.get("SENDER_NAME", "SiNoMoto")

TEMPLATE_IDS = {
    "register": int(os.environ.get("TEMPLATE_ID_REGISTER", 0)),
    "otp": int(os.environ.get("TEMPLATE_ID_OTP", 0)),
    "reset": int(os.environ.get("TEMPLATE_ID_RESET", 0))
}

mailjet = Client(auth=(MAILJET_API_KEY, MAILJET_API_SECRET), version='v3.1')

@app.route('/send', methods=['POST'])
def send_mail():
    data = request.get_json()
    to_email = data.get('to')
    subject = data.get('subject')
    template_key = data.get('template_key')  # e.g. 'register', 'otp', 'reset'

    if not to_email or not subject:
        return jsonify({"error": "Missing required fields"}), 400

    message = {
        "From": {
            "Email": SENDER_EMAIL,
            "Name": SENDER_NAME
        },
        "To": [{
            "Email": to_email,
            "Name": to_email.split('@')[0]
        }],
        "Subject": subject
    }

    if template_key and template_key in TEMPLATE_IDS and TEMPLATE_IDS[template_key] > 0:
        message["TemplateID"] = TEMPLATE_IDS[template_key]
        message["TemplateLanguage"] = True
        message["Variables"] = data.get("variables", {})
    else:
        message["TextPart"] = data.get("text", "")
        message["HTMLPart"] = data.get("html", "<p>No HTML content provided</p>")

    payload = { 'Messages': [message] }
    result = mailjet.send.create(data=payload)
    return jsonify({
        "status": result.status_code,
        "response": result.json()
    }), result.status_code

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=6000)
