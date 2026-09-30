from app.db.database import get_connection
from pathlib import Path
from app.pdfExtractor import extract_text_from_pdf, invoke_llm

base_dir = Path(__file__).resolve().parent
pdf_path = base_dir / "docs" / "Muhammad_Muneeb_CV.pdf"
 
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

