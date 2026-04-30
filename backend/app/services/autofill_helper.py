from typing import Any

SUPPORTED_PLATFORMS = {"linkedin", "indeed", "naukri"}


def prepare_autofill_payload(
    platform: str,
    parsed_job: dict[str, Any],
    match_score: int,
    tailored_resume: str,
    cover_letter: str,
    job_answers: list[str],
) -> dict[str, Any]:
    normalized_platform = platform.lower().strip()
    if normalized_platform not in SUPPORTED_PLATFORMS:
        raise ValueError("Unsupported platform. Use linkedin, indeed, or naukri.")

    role = parsed_job.get("role_title", "Unknown Role")
    skills = parsed_job.get("required_skills", [])

    field_map = {
        "full_name": "Candidate Name",
        "headline": f"Applying for {role}",
        "top_skills": ", ".join(skills[:8]),
        "work_authorization": "Fill manually based on your legal status",
        "salary_expectation": "Fill manually",
        "availability": "Immediate / Notice period as applicable",
        "cover_letter": cover_letter,
        "resume_text": tailored_resume,
        "q1": job_answers[0] if len(job_answers) > 0 else "",
        "q2": job_answers[1] if len(job_answers) > 1 else "",
        "q3": job_answers[2] if len(job_answers) > 2 else "",
    }

    if normalized_platform == "linkedin":
        field_map["linkedin_specific"] = "Review Easy Apply question fields before paste"
    elif normalized_platform == "indeed":
        field_map["indeed_specific"] = "Check screener questions and location preferences"
    elif normalized_platform == "naukri":
        field_map["naukri_specific"] = "Validate profile headline and key skills before submit"

    return {
        "platform": normalized_platform,
        "match_score": match_score,
        "recommended_action": "Apply" if match_score >= 70 else "Review",
        "fields": field_map,
        "manual_steps": [
            "Open the target job page in your browser.",
            "Use the suggested fields to autofill form entries.",
            "Attach the selected resume version.",
            "Review every answer and edit where needed.",
            "Confirm final submission yourself.",
        ],
        "checkpoints": [
            "I verified this is the correct job posting.",
            "I reviewed all autofill fields for accuracy.",
            "I confirm the resume content is truthful.",
            "I manually reviewed and approved final submission.",
        ],
        "compliance_note": "This helper never automates login or final submission.",
    }


def validate_confirmation(checkpoints_confirmed: list[bool]) -> dict[str, str]:
    if len(checkpoints_confirmed) < 4:
        return {
            "status": "blocked",
            "message": "All four confirmation checkpoints are required before applying.",
        }

    if not all(checkpoints_confirmed[:4]):
        return {
            "status": "blocked",
            "message": "Confirm each checkpoint before proceeding to manual submit.",
        }

    return {
        "status": "approved",
        "message": "All checkpoints confirmed. You may proceed with manual submission.",
    }
