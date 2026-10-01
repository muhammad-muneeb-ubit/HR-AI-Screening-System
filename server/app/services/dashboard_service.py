from app.db.database import get_connection


def get_dashboard_metrics():
    connection = None
    cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor()


        cursor.execute("SELECT COUNT(*) AS total_jobs FROM jobs;")
        total_jobs = cursor.fetchone()["total_jobs"]

        cursor.execute("SELECT COUNT(*) AS total_resumes FROM resumes;")
        total_resumes = cursor.fetchone()["total_resumes"]

        cursor.execute("SELECT COUNT(*) AS total_skills FROM skills;")
        total_skills = cursor.fetchone()["total_skills"]

        cursor.execute("SELECT COUNT(*) AS total_analysis FROM analysis;")
        total_analysis = cursor.fetchone()["total_analysis"]

        return {
            "total_jobs": total_jobs,
            "total_resumes": total_resumes,
            "total_skills": total_skills,
            "total_analysis": total_analysis
        }

    except Exception as e:
        print(f"Error fetching dashboard metrics: {e}")
        raise

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()