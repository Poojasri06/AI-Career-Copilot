from openai import OpenAI

from app.config import settings


def _fallback_cover_letter(candidate_name: str, job_description: str) -> str:
    first_line = job_description.splitlines()[0] if job_description.splitlines() else "the role"
    return (
        f"Dear Hiring Team,\n\n"
        f"I am {candidate_name}, and I am excited to apply for {first_line}. "
        "My background aligns well with the core skills in this role, and I am confident I can deliver value quickly. "
        "I would welcome the opportunity to discuss how my experience can support your team goals.\n\n"
        "Sincerely,\n"
        f"{candidate_name}"
    )


def generate_application_content(job_description: str, resume_text: str, candidate_name: str) -> dict:
    if not settings.openai_api_key:
        return {
            "cover_letter": _fallback_cover_letter(candidate_name, job_description),
            "job_answers": [
                "I am interested in this role because it aligns with my technical strengths and growth goals.",
                "My recent projects map well to the responsibilities outlined in the job description.",
                "I can contribute quickly through hands-on execution and collaborative problem solving.",
            ],
        }

    prompt = f"""
Generate concise, job-specific application content.

Job Description:
{job_description}

Resume:
{resume_text}

Candidate Name:
{candidate_name}

Return JSON with keys:
- cover_letter
- job_answers (array with 3 concise answers)
""".strip()

    client = OpenAI(api_key=settings.openai_api_key)
    response = client.responses.create(
        model=settings.model_name,
        input=prompt,
        temperature=0.4,
    )

    # The response may not always be strict JSON, so keep a safe fallback.
    text = response.output_text
    if "cover_letter" in text and "job_answers" in text:
        return {
            "cover_letter": text,
            "job_answers": [],
        }

    return {
        "cover_letter": text,
        "job_answers": [],
    }
