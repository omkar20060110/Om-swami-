from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__, static_folder="../frontend/dist", static_url_path="/")
# Enable CORS for the frontend origin
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configure SQLite Database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'export_app.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'super-secret-key-change-in-prod'

from models import db
db.init_app(app)

from routes_auth import auth_bp
from routes_main import main_bp
from routes_extra import extra_bp

app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(main_bp, url_prefix='/api')
app.register_blueprint(extra_bp, url_prefix='/api')

from flask import send_from_directory

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"}), 200

# Serve React App
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    # Initialize the app context to create tables if they don't exist
    with app.app_context():
        db.create_all()
    print("Starting Flask app on port 5000...")
    app.run(debug=True, port=5000)
