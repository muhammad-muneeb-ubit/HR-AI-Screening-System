from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import os
import tempfile
from app.services.excel_service import clean_sheet_title
from fastapi.responses import StreamingResponse
from app.services.llm_services import analyze_results_for_specific_analysis, extract_text_and_call_llm, auditLogEntry, analyze_results_for_specific_job, get_all_resume, delete_resume
from app.services.job_service import get_job_info
from app.services.excel_service import create_analysis_excel
from app.db.database import get_connection

router = APIRouter(
    prefix="/resume",
    tags=["resume"]
)
    
@router.get("/")
def all_resume():
    try: 
        resumes = get_all_resume()
        if not resumes:
            raise HTTPException(
                    status_code=404,
                    detail="resumes not found"
                    )

        
        return {
            "success": True,
            "message": "Resumes retrieved successfully",
            "count": len(resumes),
            "resumes": resumes
        }
    except HTTPException:
        raise

    except Exception as e:
        print("Error fetching resumes:", repr(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to resumes info"
        )

@router.delete("/{resume_id}")
def delete(resume_id: int):
    try:
    
        deleted_resume = delete_resume(resume_id)

        if not deleted_resume:

            raise HTTPException(
                status_code=404,
                detail="Resume not found"
            )

        return {
            "success": True,
            "message": "Resume deleted successfully",
            "resume_id": deleted_resume["id"]
        }
    
    except HTTPException:
        raise

    except Exception as e:
        print("Error deleting resume:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to delete resume"
        )
            
@router.post("/{job_id}")
async def extract_text_and_llm_call(
    job_id: int,
    resume_file: list[UploadFile] = File(...)
):
    output = []

    try:
        job = get_job_info(job_id)
        if not job:
            raise HTTPException(
                status_code=404,
                detail="Job not found"
            )
        job_description = {
            "title": job["title"],
            "description": job["description"],
            "minimum_score": float(job["minimum_score"]),
            "minimum_experience": float(job["minimum_experience"]),
            "required_skills": job["required_skills"],
            "optional_skills": job["optional_skills"]
        }
    except HTTPException:
        raise

    except Exception as e:
        print("Job retrieval error:", repr(e))
        raise HTTPException(
            status_code=500,
            detail="Failed to retrieve job"
        )
    for file in resume_file:
        try:
            if file.content_type != "application/pdf":
                raise ValueError(
                    "Only PDF files are supported"
                )
            file_content = await file.read()

            MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB
            if len(file_content) > MAX_FILE_SIZE:
                raise ValueError(
                    "File size exceeds 5 MB"
                )

            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=".pdf"
            ) as temp_file:

                temp_file.write(file_content)
                temp_file_path = temp_file.name

            try:
                auditLogEntry(job["title"], file.filename, "completed", error="no error")
                extracted_texts, response = (extract_text_and_call_llm( temp_file_path, job_description, file.filename, job_id))

                output.append({
                    "filename": file.filename,
                    "status": "completed",
                    "job_title": job["title"],
                    "llm_response": response
                })

            finally:

                if os.path.exists(temp_file_path):
                    os.remove(temp_file_path)

        except Exception as e:

            print(
                f"Error processing {file.filename}:",
                repr(e)
            )
            auditLogEntry(job["title"], file.filename, "failed", error=str(e))
            output.append({
                "filename": file.filename,
                "job_title": job["title"],
                "status": "failed",
                "error": str(e)
            })
            continue

    # print("output ", output)
    return {
        "success": True,
        "message": "CV batch processing completed",
        "count": len(output),
        "completed": sum(
            1 for item in output
            if item["status"] == "completed"
        ),
        "failed": sum(
            1 for item in output
            if item["status"] == "failed"
        ),
        "results": output
    }
 
@router.get("/{job_id}")
def analyze_job_resumes(job_id: int):

    try:

        job = analyze_results_for_specific_job(job_id)

        if not job:
            raise HTTPException(
                status_code=404,
                detail="Job not found"
            )

        return {
            "success": True,
            "job_info": job
        }

    except HTTPException:
        raise

    except Exception as e:
        print("Error fetching job info:", repr(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to fetch job info"
        )
        
@router.get("/analysis/{analysis_id}")
def specific_analysis(analysis_id: int):

        try:

            job = analyze_results_for_specific_analysis(analysis_id)

            if not job:
                raise HTTPException(
                    status_code=404,
                    detail="Job not found"
                )

            return {
                "success": True,
                "job_info": job
            }

        except HTTPException:
            raise

        except Exception as e:
            print("Error fetching job info:", repr(e))

            raise HTTPException(
                status_code=500,
                detail="Failed to fetch job info"
            )
            
@router.get("/export/{job_id}")
def export_job_analysis(job_id: int):

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
        # print("title: ", rows[0]["title"] if rows else "No rows found")
        # print("rows: ", rows)
        # print("count: ", len(rows))
        job_title = clean_sheet_title(rows[0]["title"]) if rows else "No Title"

        if not rows:
            raise HTTPException(
                status_code=404,
                detail="No resume analysis found for this job"
            )

        excel_file = create_analysis_excel(rows, job_title)

        filename = f"{job_title}_resume_analysis.xlsx"

        return StreamingResponse(
            excel_file,
            media_type=(
                "application/vnd.openxmlformats-officedocument."
                "spreadsheetml.sheet"
            ),
            headers={
                "Content-Disposition": (
                    f'attachment; filename="{filename}"'
                )
            }
        )

    except HTTPException:
        raise
    

    except Exception as e:
        print("Excel export error:", repr(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to generate Excel file"
        )

    finally:
        if cursor:
            cursor.close()

        if connection:
            connection.close()