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
            
def add_skill_to_job(job_id, skill_data):

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            INSERT INTO job_skills (
                job_id,
                skill_id,
                skill_type
            )
            VALUES (%s, %s, %s)
            RETURNING *;
        """

        values = (
            job_id,
            skill_data.skill_id,
            skill_data.skill_type
        )

        cursor.execute(query, values)

        job_skill = cursor.fetchone()

        connection.commit()

        return job_skill

    except Exception:

        if connection:
            connection.rollback()

        raise

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()            
            
def get_job_info(job_id):

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()
        query = """
                SELECT
                    j.id,
                    j.title,
                    j.description,
                    j.minimum_score,
                    j.minimum_experience,
                    STRING_AGG(
                        CASE
                            WHEN js.skill_type = 'required'
                            THEN s.name
                        END,
                        ', '
                        ORDER BY s.name
                    ) AS required_skills,
                    STRING_AGG(
                        CASE
                            WHEN js.skill_type = 'optional'
                            THEN s.name
                        END,
                        ', '
                        ORDER BY s.name
                    ) AS optional_skills
                FROM jobs j
                LEFT JOIN job_skills js
                    ON js.job_id = j.id
                LEFT JOIN skills s
                    ON js.skill_id = s.id
                WHERE j.id = %s
                GROUP BY j.id, j.title, j.description, j.minimum_score, j.minimum_experience;
        """
        cursor.execute(query, (job_id,))
        return cursor.fetchone()

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
            
def remove_skill_from_job(job_id, skill_id):

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            DELETE FROM job_skills
            WHERE job_id = %s
              AND skill_id = %s
            RETURNING id;
        """

        cursor.execute(
            query,
            (job_id, skill_id)
        )

        result = cursor.fetchone()

        if not result:
            connection.rollback()
            return None

        connection.commit()

        return result

    except Exception:

        if connection:
            connection.rollback()

        raise

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()
            
