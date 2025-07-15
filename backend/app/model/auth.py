import jwt
import datetime
from functools import wraps
from flask import request, jsonify
from app.model.data_model import User

SECRET_KEY = 'your_secret_key_here'

def create_auth_token(users_id, expiration_hours=1):
    expiration = datetime.datetime.utcnow() + datetime.timedelta(hours=expiration_hours)
    payload = {
        'users_id': users_id
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')
    return token


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')  # Retrieve token from 'Authorization' header
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            if token.startswith('Bearer '):
                token = token.split(' ')[1]  # Extract the actual token string

            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            current_user = User.query.filter_by(id=data['users_id']).first()
            if not current_user:
                return jsonify({'message': 'User not found!'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated
