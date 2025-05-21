import os
import psycopg2
from psycopg2.extras import RealDictCursor

def get_db_connection():
    try:
        conn = psycopg2.connect(
            dbname=os.getenv("DB_NAME"),
            user=os.getenv("DB_UNAME"),
            password=os.getenv("DB_PW"),
            host=os.getenv("DB_HOST_NAME"),
            port=os.getenv("DB_PORT"),
            cursor_factory=RealDictCursor
        )
        return conn
    except Exception as e:
        print("Database connection failed:", e)
        return None