import re
from collections import Counter
from math import sqrt
from typing import List

from app.services.parser import COMMON_SKILLS


WEIGHTS = {
    "skills": 0.4,
    "projects": 0.3,
    "experience": 0.2,
    "preferences": 0.1,
}


def _extract_years(text: str) -> int:
    matches = re.findall(r"(\\d+)\s*\+?\s*years", text.lower())
    if not matches:
        return 0
    return max(int(v) for v in matches)


def _similarity(a: str, b: str) -> float:
    tokens_a = re.findall(r"[a-zA-Z]{3,}", a.lower())
    tokens_b = re.findall(r"[a-zA-Z]{3,}", b.lower())

    if not tokens_a or not tokens_b:
        return 0.0

    vec_a = Counter(tokens_a)
    vec_b = Counter(tokens_b)
    shared = set(vec_a).intersection(vec_b)
    numerator = sum(vec_a[t] * vec_b[t] for t in shared)
    denom_a = sqrt(sum(v * v for v in vec_a.values()))
    denom_b = sqrt(sum(v * v for v in vec_b.values()))
    if denom_a == 0 or denom_b == 0:
        return 0.0
    return numerator / (denom_a * denom_b)


def compute_match(job_description: str, resume_text: str, preference_keywords: List[str]) -> dict:
    job_lower = job_description.lower()
    resume_lower = resume_text.lower()

    job_skills = sorted(skill for skill in COMMON_SKILLS if skill in job_lower)
    resume_skills = sorted(skill for skill in COMMON_SKILLS if skill in resume_lower)

    matched_skills = [skill for skill in job_skills if skill in resume_skills]
    missing_skills = [skill for skill in job_skills if skill not in resume_skills]

    skills_score = len(matched_skills) / max(1, len(job_skills))

    project_score = _similarity(job_description, resume_text)

    job_years = _extract_years(job_description)
    resume_years = _extract_years(resume_text)
    if job_years == 0:
        experience_score = 1.0
    else:
        experience_score = min(1.0, resume_years / job_years)

    prefs_lower = [p.lower().strip() for p in preference_keywords if p.strip()]
    if not prefs_lower:
        preferences_score = 1.0
    else:
        matches = sum(1 for p in prefs_lower if p in job_lower)
        preferences_score = matches / len(prefs_lower)

    weighted = (
        skills_score * WEIGHTS["skills"]
        + project_score * WEIGHTS["projects"]
        + experience_score * WEIGHTS["experience"]
        + preferences_score * WEIGHTS["preferences"]
    )

    score = max(0, min(100, int(round(weighted * 100))))

    strength_areas = []
    if skills_score >= 0.7:
        strength_areas.append("Strong skills alignment")
    if project_score >= 0.6:
        strength_areas.append("Relevant project background")
    if experience_score >= 0.8:
        strength_areas.append("Experience level is aligned")
    if preferences_score >= 0.7:
        strength_areas.append("Matches your role preferences")

    return {
        "score": score,
        "missing_skills": missing_skills,
        "strength_areas": strength_areas or ["Baseline match available"],
        "components": {
            "skills": round(skills_score * 100, 1),
            "projects": round(project_score * 100, 1),
            "experience": round(experience_score * 100, 1),
            "preferences": round(preferences_score * 100, 1),
        },
    }
