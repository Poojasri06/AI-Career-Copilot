from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models import ApplicationRecord, ComplianceEvent, ConsentRecord, UserAccount
from app.schemas import ComplianceEventRequest, ConsentRequest, TrackerCreate


def create_application(db: Session, payload: TrackerCreate) -> ApplicationRecord:
    item = ApplicationRecord(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def list_applications(db: Session):
    return db.query(ApplicationRecord).order_by(ApplicationRecord.created_at.desc()).all()


def analytics(db: Session) -> dict:
    total = db.query(func.count(ApplicationRecord.id)).scalar() or 0
    interview = db.query(func.count(ApplicationRecord.id)).filter(ApplicationRecord.status == "Interview").scalar() or 0
    rejected = db.query(func.count(ApplicationRecord.id)).filter(ApplicationRecord.status == "Rejected").scalar() or 0
    applied = db.query(func.count(ApplicationRecord.id)).filter(ApplicationRecord.status == "Applied").scalar() or 0
    response_rate = round((interview / applied) * 100, 1) if applied else 0.0

    best_resume = (
        db.query(ApplicationRecord.resume_version, func.count(ApplicationRecord.id).label("count"))
        .group_by(ApplicationRecord.resume_version)
        .order_by(func.count(ApplicationRecord.id).desc())
        .first()
    )

    return {
        "application_count": total,
        "interview_count": interview,
        "rejected_count": rejected,
        "response_rate": response_rate,
        "best_performing_resume": best_resume[0] if best_resume else "N/A",
    }


def get_user_by_email(db: Session, email: str) -> UserAccount | None:
    return db.query(UserAccount).filter(UserAccount.email == email.lower().strip()).first()


def create_user(db: Session, email: str, full_name: str, password_hash: str) -> UserAccount:
    user = UserAccount(email=email.lower().strip(), full_name=full_name.strip(), password_hash=password_hash)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def create_consent(db: Session, user_id: int, payload: ConsentRequest) -> ConsentRecord:
    record = ConsentRecord(
        user_id=user_id,
        terms_version=payload.terms_version,
        consent_given=payload.consent_given,
        consent_text=payload.consent_text,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def get_latest_consent(db: Session, user_id: int) -> ConsentRecord | None:
    return (
        db.query(ConsentRecord)
        .filter(ConsentRecord.user_id == user_id)
        .order_by(ConsentRecord.created_at.desc())
        .first()
    )


def create_compliance_event(db: Session, user_id: int, payload: ComplianceEventRequest) -> ComplianceEvent:
    event = ComplianceEvent(
        user_id=user_id,
        event_type=payload.event_type,
        platform=payload.platform,
        job_link=payload.job_link,
        details_json=payload.details_json,
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return event


def list_compliance_events(db: Session, user_id: int, limit: int = 50):
    return (
        db.query(ComplianceEvent)
        .filter(ComplianceEvent.user_id == user_id)
        .order_by(ComplianceEvent.created_at.desc())
        .limit(limit)
        .all()
    )
