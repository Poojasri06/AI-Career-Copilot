from openai import OpenAI

from app.config import settings


def tailor_resume(base_resume: str, job_description: str) -> str:
    prompt = f"""
You are an expert resume optimizer.

Given:
1. A base resume
2. A job description

Task:
- Tailor the resume to better match the job
- Highlight relevant skills and projects
- Rewrite bullet points for alignment
- Maintain truthfulness (no fake experience)
- Keep formatting clean and professional

Output:
- Updated resume content only
- No explanations

Base Resume:
{base_resume}

Job Description:
{job_description}
""".strip()

    if not settings.openai_api_key:
        return "AI key not configured. Add OPENAI_API_KEY to generate tailored resume output.\n\n" + base_resume

    client = OpenAI(api_key=settings.openai_api_key)
    response = client.responses.create(
        model=settings.model_name,
        input=prompt,
        temperature=0.2,
    )
    return response.output_text
