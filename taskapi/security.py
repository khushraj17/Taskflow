from pwdlib import PasswordHash
from datetime import datetime, timedelta, timezone
from config import JWT_SECRET_KEY, JWT_ALGORITHM , ACCESS_TOKEN_EXPIRE_MINUTES
import jwt

password_hash = PasswordHash.recommended()


def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(
    plain_password: str,
    hashed_password: str,
) -> bool:
    return password_hash.verify(
        plain_password,
        hashed_password,
    )


def create_access_token(subject: str) -> str:

    expires_at = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    payload = {
        "sub": subject,
        "exp": expires_at
    }

    token = jwt.encode(payload, JWT_SECRET_KEY , algorithm = JWT_ALGORITHM)

    return token 


def decode_access_token(token: str) -> dict | None:
    try:
        payload = jwt.decode(
            token,
            JWT_SECRET_KEY,
            algorithms=[JWT_ALGORITHM],
        )
        return payload

    except jwt.InvalidTokenError:
        return None