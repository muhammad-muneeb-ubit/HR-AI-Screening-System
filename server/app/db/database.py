import os
import psycopg2
from dotenv import load_dotenv
from psycopg2.extras import RealDictCursor

from app.core.config import (
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
)


def get_connection():
    try:
        return psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        cursor_factory=RealDictCursor,
    )
    except Exception as e:
        print("Error connecting to the database:", repr(e))
        raise
