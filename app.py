from flask import Flask, request, jsonify, session, Blueprint
from dataclasses import dataclass, asdict
import json
import os
from typing import Dict, List, Optional, Any, Tuple

# ============================================================================
# Configuration
# ============================================================================

class Config:
    """Application configuration."""
    SECRET_KEY = 'romsdal_vgs_secret_key'
    USERS_FILE = 'data/users.json'
    DEBUG = True

# ============================================================================
# Data Models
# ============================================================================

@dataclass
class User:
    """User model."""
    id: int
    username: str
    password: str
    name: str = ""
    class_name: str = "Ikke angitt"
    birthdate: str = "01.01.2000"
    age: int = 0
    email: str = ""
    phone: str = ""
    profile_image: str = "https://via.placeholder.com/150"
    about: str = "Ingen informasjon ennå"
    
    def to_dict(self, exclude_password: bool = False) -> Dict[str, Any]:
        """Convert user to dictionary."""
        data = asdict(self)
        # Rename class_name back to class for API compatibility
        data["class"] = data.pop("class_name")
        data["profileImage"] = data.pop("profile_image")
        
        if exclude_password:
            data.pop("password", None)
        
        return data
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'User':
        """Create user from dictionary."""
        # Handle the class field name conversion
        class_name = data.pop("class", "Ikke angitt") if "class" in data else data.get("class_name", "Ikke angitt")
        profile_image = data.pop("profileImage", "https://via.placeholder.com/150") if "profileImage" in data else data.get("profile_image", "https://via.placeholder.com/150")
        
        return cls(
            id=data.get("id", 0),
            username=data.get("username", ""),
            password=data.get("password", ""),
            name=data.get("name", ""),
            class_name=class_name,
            birthdate=data.get("birthdate", "01.01.2000"),
            age=data.get("age", 0),
            email=data.get("email", ""),
            phone=data.get("phone", ""),
            profile_image=profile_image,
            about=data.get("about", "Ingen informasjon ennå")
        )

@dataclass
class Comment:
    """Comment model."""
    id: int
    user_id: int
    text: str
    created_at: str
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert comment to dictionary."""
        data = asdict(self)
        data["userId"] = data.pop("user_id")
        data["createdAt"] = data.pop("created_at")
        return data
    
    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> 'Comment':
        """Create comment from dictionary."""
        return cls(
            id=data.get("id", 0),
            user_id=data.get("userId", 0),
            text=data.get("text", ""),
            created_at=data.get("createdAt", "")
        )

# ============================================================================
# Data Service
# ============================================================================

class DataService:
    """Service for data operations."""
    
    @staticmethod
    def read_data() -> Dict[str, Any]:
        """Read data from file."""
        users_file = Config.USERS_FILE
        if not os.path.exists(users_file):
            return {"users": [], "comments": []}
        
        try:
            with open(users_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        except (json.JSONDecodeError, IOError) as e:
            print(f"Error reading data: {e}")
            return {"users": [], "comments": []}
    
    @staticmethod
    def write_data(data: Dict[str, Any]) -> bool:
        """Write data to file."""
        users_file = Config.USERS_FILE
        os.makedirs(os.path.dirname(users_file), exist_ok=True)
        
        try:
            with open(users_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            return True
        except IOError as e:
            print(f"Error writing data: {e}")
            return False
    
    @classmethod
    def get_all_users(cls) -> List[User]:
        """Get all users."""
        data = cls.read_data()
        return [User.from_dict(user_data) for user_data in data.get('users', [])]
    
    @classmethod
    def get_user_by_id(cls, user_id: int) -> Optional[User]:
        """Get user by ID."""
        users = cls.get_all_users()
        return next((user for user in users if user.id == user_id), None)
    
    @classmethod
    def get_user_by_username(cls, username: str) -> Optional[User]:
        """Get user by username."""
        users = cls.get_all_users()
        return next((user for user in users if user.username == username), None)
    
    @classmethod
    def add_user(cls, user: User) -> Tuple[bool, str]:
        """Add a new user."""
        data = cls.read_data()
        
        # Check if username already exists
        if any(u.get('username') == user.username for u in data['users']):
            return False, "Brukernavnet er allerede i bruk"
        
        # Set new user ID
        if not user.id:
            user.id = len(data['users']) + 1
        
        # Add user to data
        data['users'].append(user.to_dict())
        
        # Write data to file
        if cls.write_data(data):
            return True, "Registrering vellykket"
        return False, "Feil ved registrering"
    
    @classmethod
    def get_user_comments(cls, user_id: int) -> List[Comment]:
        """Get comments for a user."""
        data = cls.read_data()
        return [
            Comment.from_dict(comment) 
            for comment in data.get('comments', []) 
            if comment.get('userId') == user_id
        ]

# ============================================================================
# Authentication Service
# ============================================================================

class AuthService:
    """Service for authentication operations."""
    
    @staticmethod
    def login(username: str, password: str) -> Tuple[bool, str, Optional[int]]:
        """Login a user."""
        if not username or not password:
            return False, "Brukernavn og passord er påkrevd", None
        
        user = DataService.get_user_by_username(username)
        
        # In a real application, use check_password_hash for password verification
        if not user or user.password != password:
            return False, "Ugyldig brukernavn eller passord", None
        
        return True, "Innlogging vellykket", user.id
    
    @staticmethod
    def register(username: str, password: str) -> Tuple[bool, str]:
        """Register a new user."""
        if not username or not password:
            return False, "Brukernavn og passord er påkrevd"
        
        new_user = User(
            id=0,  # Will be set in add_user
            username=username,
            password=password,  # In a real app, use generate_password_hash
            name=f"Elev {username}"
        )
        
        return DataService.add_user(new_user)
    
    @staticmethod
    def is_authenticated() -> bool:
        """Check if user is authenticated."""
        return 'user_id' in session
    
    @staticmethod
    def get_current_user_id() -> Optional[int]:
        """Get current user ID from session."""
        return session.get('user_id')
    
    @staticmethod
    def logout() -> None:
        """Logout current user."""
        session.pop('user_id', None)

# ============================================================================
# Flask Application Setup
# ============================================================================

app = Flask(__name__, static_folder='.', static_url_path='')
app.secret_key = Config.SECRET_KEY

# Ensure data directory exists
os.makedirs('data', exist_ok=True)

# ============================================================================
# Authentication Routes
# ============================================================================

@app.route('/api/login', methods=['POST'])
def login():
    """User login endpoint."""
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')
    
    success, message, user_id = AuthService.login(username, password)
    
    if success and user_id:
        session['user_id'] = user_id
        return jsonify(success=True, message=message)
    
    status_code = 400 if message == "Brukernavn og passord er påkrevd" else 401
    return jsonify(success=False, message=message), status_code

@app.route('/api/register', methods=['POST'])
def register():
    """User registration endpoint."""
    data = request.json or {}
    username = data.get('username')
    password = data.get('password')
    
    success, message = AuthService.register(username, password)
    
    if success:
        return jsonify(success=True, message=message)
    
    return jsonify(success=False, message=message), 400

@app.route('/api/auth-status')
def auth_status():
    """Check authentication status."""
    return jsonify(authenticated=AuthService.is_authenticated())

@app.route('/api/logout')
def logout():
    """User logout endpoint."""
    AuthService.logout()
    return jsonify(success=True, message="Utlogging vellykket")

# ============================================================================
# User Routes
# ============================================================================

@app.route('/api/profile')
def profile():
    """Get current user profile."""
    if not AuthService.is_authenticated():
        return jsonify(success=False, message="Ikke innlogget"), 401
    
    user_id = AuthService.get_current_user_id()
    user = DataService.get_user_by_id(user_id)
    
    if not user:
        return jsonify(success=False, message="Bruker ikke funnet"), 404
    
    return jsonify(user.to_dict(exclude_password=True))

@app.route('/api/comments')
def comments():
    """Get comments for current user."""
    if not AuthService.is_authenticated():
        return jsonify(success=False, message="Ikke innlogget"), 401
    
    user_id = AuthService.get_current_user_id()
    user_comments = DataService.get_user_comments(user_id)
    
    return jsonify([comment.to_dict() for comment in user_comments])

# ============================================================================
# Main Routes
# ============================================================================

@app.route('/')
def index():
    """Serve the main page."""
    return app.send_static_file('index.html')

# ============================================================================
# Application Entry Point
# ============================================================================

if __name__ == '__main__':
    app.run(debug=Config.DEBUG)
    