from app.db.database import get_connection


def create_skill(skill_data):

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO skills (name)
            VALUES (%s)
            RETURNING *;
        """

        cursor.execute(
            query,
            (skill_data.name,)
        )

        skill = cursor.fetchone()

        connection.commit()

        return skill

    except Exception:

        if connection:
            connection.rollback()

        raise

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


def get_all_skills():

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            SELECT *
            FROM skills
            ORDER BY name ASC;
        """

        cursor.execute(query)

        skills = cursor.fetchall()

        return skills

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


def get_skill_by_id(skill_id):

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            SELECT *
            FROM skills
            WHERE id = %s;
        """

        cursor.execute(
            query,
            (skill_id,)
        )

        skill = cursor.fetchone()

        return skill

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()


def delete_skill(skill_id):

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            DELETE FROM skills
            WHERE id = %s
            RETURNING id;
        """

        cursor.execute(
            query,
            (skill_id,)
        )

        deleted_skill = cursor.fetchone()

        if not deleted_skill:
            connection.rollback()
            return None

        connection.commit()

        return deleted_skill

    except Exception:

        if connection:
            connection.rollback()

        raise

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()