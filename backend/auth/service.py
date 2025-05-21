from auth.utils import hash_password, check_password, generate_tokens
from db import get_db_connection

def is_user_in_db(cursor, email):
    try:
        query = "SELECT * FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        result = cursor.fetchone()
        return result is not None
    except Exception as e:
        print("Database query failed while user lookup:", e)
        return False

def signup(data):
    email = data.get("email")
    username = data.get("username")
    password = data.get("password")

    conn = get_db_connection()
    if not conn:
        return {"message": "Failed to connect to the database", "authenticated": False}

    try:
        cursor = conn.cursor()

        if is_user_in_db(cursor, email):
            cursor.close()
            return {"message": "User already exists.", "authenticated": False}

        hashed = hash_password(password)

        query = "INSERT INTO users (email, username, password) VALUES (%s, %s, %s)"
        cursor.execute(query, (email, username, hashed))
        conn.commit()
        cursor.close()

        access_token, refresh_token = generate_tokens(email)

        return {
            "message": "Account setup successful",
            "authenticated": True,
            "username": username,
            "access_token": access_token,
            "refresh_token": refresh_token
        }

    except Exception as e:
        print("Database query failed during signup:", e)
        return {"message": "Failed to create new user", "authenticated": False}

    finally:
        conn.close()

def signin(data):
    email = data.get("email")
    password = data.get("password")
    conn = get_db_connection()
    query = """
    SELECT * FROM users WHERE email = %s
    """
    try:
        cursor = conn.cursor()
        query = "SELECT * FROM users WHERE email = %s"
        cursor.execute(query, (email,))
        record = cursor.fetchone()

        if not record or not check_password(password, record["password"]):
            return {"message": "Invalid credentials", "authenticated": False}

        access_token, refresh_token = generate_tokens(email)
        return {
            "message": "Signin successful",
            "authenticated": True,
            "username": record["username"],
            "access_token": access_token,
            "refresh_token": refresh_token
        }

    except Exception as e:
        print("Database query failed:", e)
        return {"message": "Failed to sign in", "authenticated": False}

    finally:
        cursor.close()
        conn.close()