import bcrypt
import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os

load_dotenv()

def hash_password(password: str):
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def check_password(password: str, hashed: str):
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def generate_tokens(user: str):
    access_token = jwt.encode(
        {"email": user, "exp": datetime.now(timezone.utc) + timedelta(minutes=15)},
        os.getenv("ACCESS_TOKEN_SECRET", "jwtsecret"),
        algorithm="HS256"
    )

    refresh_token = jwt.encode(
        {"email": user, "exp": datetime.now(timezone.utc) + timedelta(days=1)},
        os.getenv("REFRESH_TOKEN_SECRET", "supersecret"),
        algorithm="HS256"
    )

    return access_token, refresh_token

def generate_new_access_token(refresh_token: str):
    try:
        payload = jwt.decode(
            refresh_token,
            os.getenv("REFRESH_TOKEN_SECRET", "supersecret"),
            algorithms=["HS256"]
        )
        email = payload["email"]

        access_token = jwt.encode(
            {"email": email, "exp": datetime.now(timezone.utc) + timedelta(minutes=15)},
            os.getenv("ACCESS_TOKEN_SECRET", "jwtsecret"),
            algorithm="HS256"
        )
        return access_token

    except jwt.ExpiredSignatureError:
        print("Refresh token expired.")
        return None
    except jwt.InvalidTokenError:
        print("Invalid refresh token.")
        return None

def verify_access_token(token: str):
    try:
        return jwt.decode(token, os.getenv("ACCESS_TOKEN_SECRET", "jwtsecret"), algorithms=["HS256"])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None