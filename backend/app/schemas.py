from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class JobInput(BaseModel):
    job_description: str
    job_link: Optional[str] = None


class RegisterRequest(BaseModel):
    email: str
    full_name: str
    password: str = Field(min_length=8)


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    full_name: str


class UserProfile(BaseModel):
    id: int
    email: str
    full_name: str

    class Config:
        from_attributes = True


class ParsedJob(BaseModel):
    role_title: str
    experience_level: str
    required_skills: List[str]
    tools_technologies: List[str]
    keywords: List[str]


class MatchRequest(BaseModel):
    job_description: str
    resume_text: str
    preference_keywords: List[str] = Field(default_factory=list)


class MatchResult(BaseModel):
    score: int
    missing_skills: List[str]
    strength_areas: List[str]
    components: dict


class TailorRequest(BaseModel):
    base_resume: str
    job_description: str


class TailorResponse(BaseModel):
    tailored_resume: str


class ResumeUploadResponse(BaseModel):
    filename: str
    resume_text: str


class ContentRequest(BaseModel):
    job_description: str
    resume_text: str
    candidate_name: str = "Candidate"


class ContentResponse(BaseModel):
    cover_letter: str
    job_answers: List[str]


class DecisionRequest(BaseModel):
    match_score: int
    job_alignment: int = Field(ge=0, le=100)
    similar_roles_applied: int = 0


class DecisionResponse(BaseModel):
    recommendation: str
    reason: str


class AutofillPrepareRequest(BaseModel):
    platform: str = Field(description="linkedin|indeed|naukri")
    parsed_job: dict = Field(default_factory=dict)
    match_score: int = 0
    tailored_resume: str = ""
    cover_letter: str = ""
    job_answers: List[str] = Field(default_factory=list)


class AutofillPrepareResponse(BaseModel):
    platform: str
    match_score: int
    recommended_action: str
    fields: dict
    manual_steps: List[str]
    checkpoints: List[str]
    compliance_note: str


class AutofillConfirmRequest(BaseModel):
    checkpoints_confirmed: List[bool]


class AutofillConfirmResponse(BaseModel):
    status: str
    message: str


class ConsentRequest(BaseModel):
    terms_version: str = "v1"
    consent_given: bool
    consent_text: str


class ConsentResponse(BaseModel):
    id: int
    user_id: int
    terms_version: str
    consent_given: bool
    consent_text: str
    created_at: datetime

    class Config:
        from_attributes = True


class ComplianceEventRequest(BaseModel):
    event_type: str
    platform: Optional[str] = None
    job_link: Optional[str] = None
    details_json: Optional[str] = None


class ComplianceEventResponse(BaseModel):
    id: int
    user_id: int
    event_type: str
    platform: Optional[str] = None
    job_link: Optional[str] = None
    details_json: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TrackerCreate(BaseModel):
    company: str
    job_title: str
    job_link: Optional[str] = None
    resume_version: str = "base"
    status: str = "Review"
    recommendation: str = "Review"
    match_score: int = 0
    notes: Optional[str] = None


class TrackerItem(TrackerCreate):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
