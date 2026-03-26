from flask import Blueprint, request, jsonify, current_app
from models import User, db
import jwt
from datetime import datetime, timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Missing username or password'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if user and user.check_password(data['password']):
        token = jwt.encode({
            'user_id': user.id,
            'role': user.role,
            'exp': datetime.utcnow() + timedelta(hours=24)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({'token': token, 'role': user.role}), 200
        
    return jsonify({'message': 'Invalid credentials'}), 401

# Run this once manually or in app context to create first admin
@auth_bp.route('/setup-admin', methods=['POST'])
def setup_admin():
    if User.query.first():
        return jsonify({'message': 'Admin already exists'}), 400
    
    data = request.get_json()
    new_admin = User(username=data.get('username', 'admin'), email=data.get('email', 'admin@example.com'), role='Super Admin')
    new_admin.set_password(data.get('password', 'admin123'))
    db.session.add(new_admin)
    db.session.commit()
    
    return jsonify({'message': 'Super Admin created successfully'}), 201

@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data or not data.get('username') or not data.get('password') or not data.get('email'):
        return jsonify({'message': 'Missing required fields'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'message': 'Username already exists'}), 400
        
    new_user = User(username=data['username'], email=data['email'], role='Content Manager')
    new_user.set_password(data['password'])
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully'}), 201
