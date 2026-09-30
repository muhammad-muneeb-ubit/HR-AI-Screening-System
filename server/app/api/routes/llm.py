from fastapi import APIRouter, UploadFile, File, Form, HTTPException
import os
import tempfile
from app.services.llm_services import extract_text_and_call_llm
from app.services.job_service import get_job_info

router = APIRouter(
    prefix="/resume",
    tags=["resume"]
)
    
@router.post("/{job_id}")
async def extract_text_and_llm_call( job_id: int , resume_file: list[UploadFile] = File(...)):
    try:
        output = []
        job = get_job_info(job_id)
        
        job_description = {
            "title": job["title"],
            "description": job["description"],
            "minimum_score": float(job["minimum_score"]),
            "minimum_experience": float(job["minimum_experience"]),
            "required_skills": job["required_skills"],
            "optional_skills": job["optional_skills"]
        }
        # print(f"Constructed job_description: {job_description}")
        # print("Received job_description:", job.get("description"))
        # print("\nReceived resume_file:", [file.filename for file in resume_file])
        for file in resume_file:
            if file.content_type != "application/pdf":
                raise HTTPException(
                    status_code=400,
                    detail="Only PDF files are supported"
                )
            # print("\nProcessing file:", file.filename)
            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=".pdf"
            ) as temp_file:
                temp_file.write(await file.read())
                temp_file_path = temp_file.name

            try:
                extracted_texts, response = extract_text_and_call_llm(temp_file_path, job_description, file.filename, job_id)
                # print("\nLLM response:", response)
                llm_output = {
                    "filename": file.filename,
                    "llm_response": response,
                    "extracted_text_for_debugging": extracted_texts
                }
                output.append(llm_output)
            finally:
                if os.path.exists(temp_file_path):
                    os.remove(temp_file_path)
        return {
            "success": True,
            "message": "CV analysis completed successfully",
            "count": len(output),   
            "results": output

        }

    except HTTPException:
        raise

    except Exception as e:
        print( "Error in extract_text_and_llm_call:", repr(e))

        raise HTTPException(
            status_code=500,
            detail="Failed to extract text and invoke LLM"
        )