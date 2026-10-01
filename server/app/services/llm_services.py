from app.db.database import get_connection
from pathlib import Path
from app.pdfExtractor import extract_text_from_pdf, invoke_llm

base_dir = Path(__file__).resolve().parent
pdf_path = base_dir / "docs" / "Muhammad_Muneeb_CV.pdf"
 
def get_all_resume():
    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor()
        query = """
            SELECT r.id, r.file_name, r.candidate_name, r.candidate_email, r.candidate_phone
            FROM resumes r
            ORDER BY r.created_at DESC;

        """

        cursor.execute(query)
        rows = cursor.fetchall()

        return {
            "success": True,
            "count": len(rows),
            "resumes": rows
        }

    except Exception as e:
        if connection:
            connection.rollback()
        raise

    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close() 
 
def delete_resume(resume_id):

    connection = None
    cursor = None

    try:

        connection = get_connection()
        cursor = connection.cursor()

        query = """
            DELETE FROM resumes
            WHERE id = %s
            RETURNING id;
        """

        cursor.execute(
            query,
            (resume_id,)
        )

        deleted_resume = cursor.fetchone()
        print("Deleted resume:", deleted_resume)
        if not deleted_resume:
            connection.rollback()
            return None

        connection.commit()

        return deleted_resume

    except Exception as e:
        print("Error deleting resume:", repr(e))

        if connection:
            connection.rollback()

        raise

    finally:

        if cursor:
            cursor.close()

        if connection:
            connection.close()
 
def extract_text_and_call_llm(pdf_path, job_description, file_name, job_id):

    extracted_texts = extract_text_from_pdf(pdf_path)
    response = invoke_llm(job_description, resume_text = extracted_texts, file_name = file_name)
    # print("\response:", response.file_name, response.candidate_name, response.candidate_email, response.candidate_phone)
    connection = None
    cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        query = """
            INSERT INTO resumes (
                file_name,candidate_name,candidate_email,candidate_phone,extracted_text
            )
            VALUES (%s, %s, %s, %s, %s)
            RETURNING id;
        """
        values = (
            response.file_name, response.candidate_name, response.candidate_email, response.candidate_phone, extracted_texts
        )

        cursor.execute(query, values)
        resume_id = cursor.fetchone()["id"]
        
        analysis_query = """
            INSERT INTO analysis (
                resume_id,
                job_id,
                status,
                score,
                skills_analysis,
                experience_analysis,
                qualifications_analysis,
                overall_response
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """
        analysis_values = (
            resume_id,
            job_id,
            response.status,
            response.score,
            response.score_breakdown.skills,
            response.score_breakdown.experience,
            response.score_breakdown.qualifications,
            response.response
        )

        cursor.execute(analysis_query, analysis_values)
        analysis_id = cursor.fetchone()["id"]
        
        print(f"Inserted analysis with ID: {analysis_id} for resume ID: {resume_id}")

        connection.commit()
    except Exception:
        if connection:
            connection.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()
    return extracted_texts, response

def auditLogEntry(job_title, file_name, status, error=None):
    connection = None
    cursor = None
    try:
        connection = get_connection()
        cursor = connection.cursor()
        query = """
            INSERT INTO audit_logs ( job_title,file_name,status,"error" )
            VALUES (%s, %s, %s, %s);
        """
        values = (job_title, file_name, status, error)
        cursor.execute(query, values)
        connection.commit()
    except Exception as e:
        print(f"Failed to insert audit log entry for {file_name}: {repr(e)}")
        if connection:
            connection.rollback()
        raise
    finally:
        if cursor:
            cursor.close()
        if connection:
            connection.close()

def analyze_results_for_specific_job(job_id):
   
    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor()
        query = """
            select j.title, r.file_name, r.candidate_name, r.candidate_email, r.candidate_phone, a.status, a.score, a.skills_analysis, a.experience_analysis, a.qualifications_analysis, a.overall_response, a.created_at
            FROM analysis a
            JOIN resumes r
                ON a.resume_id = r.id
            JOIN jobs j
                ON j.id = a.job_id
            WHERE a.job_id = %s
            ORDER BY a.score DESC, a.created_at DESC;
        """

        cursor.execute(query, (job_id,))

        rows = cursor.fetchall()
        
        if not rows:
            return{
                "success": False,
                "message": "No resume analysis found for this job"
            }
        return {
        "success": True,    
        "rows": rows
        }
            
    except Exception:
    
            if connection:
                connection.rollback()
    
            raise
    
    finally:
    
            if cursor:
                cursor.close()
    
            if connection:
                connection.close()

def analyze_results_for_specific_analysis(analysis_id):
   
    connection = None
    cursor = None

    try:
        connection = get_connection()
        cursor = connection.cursor()
        query = """
            select j.title, r.file_name, r.candidate_name, r.candidate_email, r.candidate_phone, a.status, a.score, a.skills_analysis, a.experience_analysis, a.qualifications_analysis, a.overall_response, a.created_at
            FROM analysis a
            JOIN resumes r
                ON a.resume_id = r.id
            JOIN jobs j
                ON j.id = a.job_id
                WHERE a.id = %s
            ORDER BY a.score DESC, a.created_at DESC;

        """

        cursor.execute(query, (analysis_id,))

        row = cursor.fetchone()
        
        if not row:
            return{
                "success": False,
                "message": "No specific analysis found for this analysis ID"
            }
        return {
        "success": True,    
        "rows": row
        }
            
    except Exception:
    
            if connection:
                connection.rollback()
    
            raise
    
    finally:
    
            if cursor:
                cursor.close()
    
            if connection:
                connection.close()
                
                
