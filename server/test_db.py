from app.db.database import get_connection


try:

    connection = get_connection()

    print("Database connected successfully!")

    cursor = connection.cursor()

    cursor.execute("SELECT version();")

    result = cursor.fetchone()

    print("PostgreSQL version:")
    print(result)

    cursor.close()
    connection.close()

    print("Database connection closed.")

except Exception as e:

    print("Database connection failed!")
    print(e)