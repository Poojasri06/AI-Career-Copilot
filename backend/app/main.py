from fastapi import Depends, FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.config import settings
from app.crud import (
    analytics,
    create_application,
    create_compliance_event,
    create_consent,
    create_user,
    get_latest_consent,
    get_user_by_email,
    list_applications,
    list_compliance_events,
)
from app.db import Base, engine, get_db
from app.models import UserAccount
from app.schemas import (
    AutofillConfirmRequest,
    AutofillConfirmResponse,
    AutofillPrepareRequest,
    AutofillPrepareResponse,
    AuthResponse,
    ComplianceEventRequest,
    ComplianceEventResponse,
    ConsentRequest,
    ConsentResponse,
    ContentRequest,
    ContentResponse,
    DecisionRequest,
    DecisionResponse,
    JobInput,
    LoginRequest,
    MatchRequest,
    MatchResult,
    ParsedJob,
    ResumeUploadResponse,
    RegisterRequest,
    TailorRequest,
    TailorResponse,
    TrackerCreate,
    TrackerItem,
    UserProfile,
)
from app.services.autofill_helper import prepare_autofill_payload, validate_confirmation
from app.services.auth import create_access_token, get_current_consented_user, get_current_user, hash_password, verify_password
from app.services.content_generator import generate_application_content
from app.services.decision import recommend_action
from app.services.ingestion import extract_job_text_from_upload
from app.services.matching import compute_match
from app.services.parser import parse_job_description
from app.services.resume_tailor import tailor_resume

Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Job Assistant API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[v.strip() for v in settings.cors_origins.split(",") if v.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.post("/api/auth/register", response_model=AuthResponse)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    existing = get_user_by_email(db, payload.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = create_user(db, payload.email, payload.full_name, hash_password(payload.password))
    token = create_access_token(user.id, user.email)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
        "full_name": user.full_name,
    }


@app.post("/api/auth/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token(user.id, user.email)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user_id": user.id,
        "email": user.email,
        "full_name": user.full_name,
    }


@app.get("/api/auth/me", response_model=UserProfile)
def me(current_user: UserAccount = Depends(get_current_user)):
    return current_user


@app.post("/api/jobs/parse", response_model=ParsedJob)
def parse_job(payload: JobInput, current_user: UserAccount = Depends(get_current_consented_user)):
    return parse_job_description(payload.job_description)


@app.post("/api/jobs/upload", response_model=ParsedJob)
async def parse_uploaded_job(file: UploadFile = File(...), current_user: UserAccount = Depends(get_current_consented_user)):
    content = await file.read()
    extracted_text = extract_job_text_from_upload(file.filename or "upload", content)
    return parse_job_description(extracted_text)


@app.post("/api/resume/upload", response_model=ResumeUploadResponse)
async def upload_resume(file: UploadFile = File(...), current_user: UserAccount = Depends(get_current_consented_user)):
    content = await file.read()
    extracted_text = extract_job_text_from_upload(file.filename or "resume", content)
    return {
        "filename": file.filename or "resume",
        "resume_text": extracted_text,
    }


@app.post("/api/match", response_model=MatchResult)
def match_job(payload: MatchRequest, current_user: UserAccount = Depends(get_current_consented_user)):
    return compute_match(payload.job_description, payload.resume_text, payload.preference_keywords)


@app.post("/api/resume/tailor", response_model=TailorResponse)
def tailor(payload: TailorRequest, current_user: UserAccount = Depends(get_current_consented_user)):
    return {"tailored_resume": tailor_resume(payload.base_resume, payload.job_description)}


@app.post("/api/content/generate", response_model=ContentResponse)
def content(payload: ContentRequest, current_user: UserAccount = Depends(get_current_consented_user)):
    return generate_application_content(payload.job_description, payload.resume_text, payload.candidate_name)


@app.post("/api/decision", response_model=DecisionResponse)
def decision(payload: DecisionRequest, current_user: UserAccount = Depends(get_current_consented_user)):
    return recommend_action(payload.match_score, payload.job_alignment, payload.similar_roles_applied)


@app.post("/api/autofill/prepare", response_model=AutofillPrepareResponse)
def prepare_autofill(payload: AutofillPrepareRequest, current_user: UserAccount = Depends(get_current_consented_user)):
    return prepare_autofill_payload(
        platform=payload.platform,
        parsed_job=payload.parsed_job,
        match_score=payload.match_score,
        tailored_resume=payload.tailored_resume,
        cover_letter=payload.cover_letter,
        job_answers=payload.job_answers,
    )


@app.post("/api/autofill/confirm", response_model=AutofillConfirmResponse)
def confirm_autofill(payload: AutofillConfirmRequest, current_user: UserAccount = Depends(get_current_consented_user)):
    return validate_confirmation(payload.checkpoints_confirmed)


@app.post("/api/compliance/consent", response_model=ConsentResponse)
def submit_consent(
    payload: ConsentRequest,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(get_current_user),
):
    return create_consent(db, current_user.id, payload)


@app.get("/api/compliance/consent/latest", response_model=ConsentResponse | None)
def latest_consent(db: Session = Depends(get_db), current_user: UserAccount = Depends(get_current_user)):
    return get_latest_consent(db, current_user.id)


@app.post("/api/compliance/events", response_model=ComplianceEventResponse)
def add_compliance_event(
    payload: ComplianceEventRequest,
    db: Session = Depends(get_db),
    current_user: UserAccount = Depends(get_current_user),
):
    return create_compliance_event(db, current_user.id, payload)


@app.get("/api/compliance/events", response_model=list[ComplianceEventResponse])
def get_compliance_events(db: Session = Depends(get_db), current_user: UserAccount = Depends(get_current_user)):
    return list_compliance_events(db, current_user.id)


@app.post("/api/tracker", response_model=TrackerItem)
def create_tracker(payload: TrackerCreate, db: Session = Depends(get_db), current_user: UserAccount = Depends(get_current_consented_user)):
    return create_application(db, payload)


@app.get("/api/tracker", response_model=list[TrackerItem])
def get_tracker(db: Session = Depends(get_db), current_user: UserAccount = Depends(get_current_consented_user)):
    return list_applications(db)


@app.get("/api/analytics")
def get_analytics(db: Session = Depends(get_db), current_user: UserAccount = Depends(get_current_consented_user)):
    return analytics(db)
