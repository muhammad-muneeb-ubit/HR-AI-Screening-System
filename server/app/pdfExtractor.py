from pathlib import Path
import pymupdf #type: ignore
from .core.config import llm, system_prompt
base_dir = Path(__file__).resolve().parent
# print("__file__", __file__)
# print("base_dir", base_dir)

# pdf_path = base_dir / "docs" / "Muhammad_Muneeb_CV.pdf"
# pdf_path = base_dir / "docs" / "challan.pdf"

def extract_text_from_pdf(pdf_path):
    extracted_text = ""
    doc = pymupdf.open(pdf_path) 
    for page in doc: 
        extracted_text += page.get_text() 
    doc.close()
    if len(extracted_text.strip()) < 50:
        raise ValueError(
           "The PDF does not contain enough readable resume text."
        )

    return extracted_text

def invoke_llm(job_description, resume_text, file_name):

    prompt = system_prompt
    messages = prompt.format_messages(job_description=job_description, resume_text=resume_text, file_name=file_name)
    try:
        llm_response = llm.invoke(messages)
    except Exception as e:
        print("Error invoking LLM:", repr(e))
        return {
        "status": "failed",
        "error_type": "llm_error",
        "error": str(e)
    }
    return llm_response


