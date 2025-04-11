from flask import Flask, request, jsonify, session
import json
import os
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

app = Flask(__name__, static_folder='.', static_url_path='')

# Set a secret key for session
app.secret_key = 'romsdal_vgs_secret_key'

# Path to the users data file
USERS_FILE = 'data/users.json'

# Helper function to read users data
def read_users_data():
    if not os.path.exists(USERS_FILE):
        return {"users": [], "comments": []}
    
    with open(USERS_FILE, 'r', encoding='utf-8') as file:
        return json.load(file)

# Helper function to write users data
def write_users_data(data):
    os.makedirs(os.path.dirname(USERS_FILE), exist_ok=True)
    
    with open(USERS_FILE, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=2, ensure_ascii=False)

# Route to serve the main page
@app.route('/')
def index():
    return app.send_static_file('index.html')

# API route for login
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"success": False, "message": "Brukernavn og passord er påkrevd"}), 400
    
    users_data = read_users_data()
    
    # Find user by username
    user = next((user for user in users_data['users'] if user['username'] == username), None)
    
    if not user or user['password'] != password:  # In a real app, use check_password_hash
        return jsonify({"success": False, "message": "Ugyldig brukernavn eller passord"}), 401
    
    # Set user in session
    session['user_id'] = user['id']
    
    return jsonify({"success": True, "message": "Innlogging vellykket"})

# API route for registration
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({"success": False, "message": "Brukernavn og passord er påkrevd"}), 400
    
    users_data = read_users_data()
    
    # Check if username already exists
    if any(user['username'] == username for user in users_data['users']):
        return jsonify({"success": False, "message": "Brukernavnet er allerede i bruk"}), 400
    
    # Create new user
    new_user = {
        "id": len(users_data['users']) + 1,
        "username": username,
        "password": password,  # In a real app, use generate_password_hash
        "name": f"Elev {username}",
        "class": "Ikke angitt",
        "birthdate": "01.01.2000",
        "age": 0,
        "email": "",
        "phone": "",
        "profileImage": "https://via.placeholder.com/150",
        "about": "Ingen informasjon ennå"
    }
    
    # Add user to data
    users_data['users'].append(new_user)
    write_users_data(users_data)
    
    return jsonify({"success": True, "message": "Registrering vellykket"})

# API route to check authentication status
@app.route('/api/auth-status')
def auth_status():
    if 'user_id' in session:
        return jsonify({"authenticated": True})
    return jsonify({"authenticated": False})

# API route to get user profile
@app.route('/api/profile')
def get_profile():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Ikke innlogget"}), 401
    
    user_id = session['user_id']
    users_data = read_users_data()
    
    # Find user by ID
    user = next((user for user in users_data['users'] if user['id'] == user_id), None)
    
    if not user:
        return jsonify({"success": False, "message": "Bruker ikke funnet"}), 404
    
    # Return user profile data (excluding password)
    profile_data = {k: v for k, v in user.items() if k != 'password'}
    return jsonify(profile_data)

# API route to get comments for a user
@app.route('/api/comments')
def get_comments():
    if 'user_id' not in session:
        return jsonify({"success": False, "message": "Ikke innlogget"}), 401
    
    user_id = session['user_id']
    users_data = read_users_data()
    
    # Filter comments for the current user
    user_comments = [comment for comment in users_data['comments'] if comment['userId'] == user_id]
    
    return jsonify(user_comments)

# Logout route
@app.route('/api/logout')
def logout():
    session.pop('user_id', None)
    return jsonify({"success": True, "message": "Utlogging vellykket"})

if __name__ == '__main__':
    app.run(debug=True)
