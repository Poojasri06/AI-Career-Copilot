from io import BytesIO

from fastapi import HTTPException


def extract_job_text_from_upload(filename: str, file_bytes: bytes) -> str:
    suffix = filename.lower().rsplit('.', maxsplit=1)[-1] if '.' in filename else ''

    if suffix == 'txt':
        return file_bytes.decode('utf-8', errors='ignore')

    if suffix == 'pdf':
        try:
            from pypdf import PdfReader
        except ImportError as exc:
            raise HTTPException(status_code=500, detail='pypdf dependency is missing on server') from exc

        reader = PdfReader(BytesIO(file_bytes))
        text = '\n'.join(page.extract_text() or '' for page in reader.pages)
        if not text.strip():
            raise HTTPException(status_code=400, detail='No readable text found in PDF')
        return text

    raise HTTPException(status_code=400, detail='Unsupported file type. Upload TXT or PDF.')
