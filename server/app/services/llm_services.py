from app.db.database import get_connection
from pathlib import Path
from app.pdfExtractor import extract_text_from_pdf, invoke_llm

base_dir = Path(__file__).resolve().parent
pdf_path = base_dir / "docs" / "Muhammad_Muneeb_CV.pdf"
 
def extract_text_and_call_llm(pdf_path, job_description):

    extracted_texts = extract_text_from_pdf(pdf_path)
    response = invoke_llm(job_description, resume_text = extracted_texts)
    return extracted_texts, response

