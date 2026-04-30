import re
from collections import Counter


COMMON_SKILLS = {
    "python",
    "java",
    "javascript",
    "typescript",
    "sql",
    "react",
    "node",
    "fastapi",
    "docker",
    "kubernetes",
    "aws",
    "azure",
    "gcp",
    "machine learning",
    "nlp",
    "tensorflow",
    "pytorch",
    "git",
    "mongodb",
    "postgresql",
}

EXPERIENCE_PATTERNS = [r"(\\d+\\+?\s*years)", r"(entry level|mid level|senior|lead|intern)"]


def parse_job_description(text: str) -> dict:
    lowered = text.lower()
    lines = [line.strip() for line in text.splitlines() if line.strip()]

    role_title = lines[0] if lines else "Unknown Role"

    experience_level = "Not specified"
    for pattern in EXPERIENCE_PATTERNS:
        match = re.search(pattern, lowered)
        if match:
            experience_level = match.group(1)
            break

    found_skills = sorted(skill for skill in COMMON_SKILLS if skill in lowered)

    tokens = re.findall(r"[a-zA-Z]{3,}", lowered)
    token_counts = Counter(tokens)
    stopwords = {
        "the",
        "and",
        "for",
        "with",
        "you",
        "will",
        "are",
        "our",
        "that",
        "this",
        "job",
        "role",
        "team",
        "from",
        "have",
        "your",
    }
    keywords = [word for word, _ in token_counts.most_common(20) if word not in stopwords][:10]

    tools_technologies = [skill for skill in found_skills if skill in {"docker", "kubernetes", "aws", "azure", "gcp", "postgresql", "mongodb"}]

    return {
        "role_title": role_title,
        "experience_level": experience_level,
        "required_skills": found_skills,
        "tools_technologies": tools_technologies,
        "keywords": keywords,
    }
