from app.config import settings


def recommend_action(match_score: int, job_alignment: int, similar_roles_applied: int) -> dict:
    threshold = settings.match_threshold

    if match_score >= threshold and job_alignment >= 70 and similar_roles_applied < 10:
        return {
            "recommendation": "Apply",
            "reason": "High fit score and alignment with manageable application overlap.",
        }

    if match_score >= threshold - 10 and job_alignment >= 50:
        return {
            "recommendation": "Review",
            "reason": "Potential fit, but review role specifics before applying.",
        }

    return {
        "recommendation": "Skip",
        "reason": "Current match or alignment is below your target criteria.",
    }
