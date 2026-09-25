from app.db.database import get_connection


def create_job(job_data):

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO jobs (
                title,
                description,
                minimum_score,
                minimum_experience,
                education_requirement
            )
            VALUES (%s, %s, %s, %s, %s)
            RETURNING *;
        """

        values = (
            job_data.title,
            job_data.description,
            job_data.minimum_score,
            job_data.minimum_experience,
            job_data.education_requirement
        )

        cursor.execute(query, values)

        job = cursor.fetchone()

        connection.commit()

        return job

    except Exception:

        if connection:
            connection.rollback()

        raise

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()
            
            
def get_all_jobs():

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            SELECT *
            FROM jobs
            ORDER BY created_at DESC;
        """

        cursor.execute(query)

        jobs = cursor.fetchall()

        return jobs

    except Exception:

        raise

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()
            
def get_job_by_id(job_id):

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            SELECT *
            FROM jobs
            WHERE id = %s;
        """

        cursor.execute(query, (job_id,))

        job = cursor.fetchone()

        return job

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()
            
def update_job(job_id, job_data):

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            UPDATE jobs
            SET
                title = %s,
                description = %s,
                minimum_score = %s,
                minimum_experience = %s,
                education_requirement = %s
            WHERE id = %s
            RETURNING *;
        """

        values = (
            job_data.title,
            job_data.description,
            job_data.minimum_score,
            job_data.minimum_experience,
            job_data.education_requirement,
            job_id
        )

        cursor.execute(query, values)

        job = cursor.fetchone()

        if not job:
            connection.rollback()
            return None

        connection.commit()

        return job

    except Exception:

        if connection:
            connection.rollback()

        raise

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()

def delete_job(job_id):

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            DELETE FROM jobs
            WHERE id = %s
            RETURNING id;
        """

        cursor.execute(query, (job_id,))

        deleted_job = cursor.fetchone()

        if not deleted_job:
            connection.rollback()
            return None

        connection.commit()

        return deleted_job

    except Exception:

        if connection:
            connection.rollback()

        raise

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()