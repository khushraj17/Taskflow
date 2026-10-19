from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from security import decode_access_token
from sqlalchemy.orm import Session

from database import get_db
from models import User
from schema import UserRead



oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/auth/login"
)


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = decode_access_token(token)

    if payload is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail= "Invalid or expired token",
                            headers={"WWW-Authenticate": "Bearer"})

    user_id = payload.get("sub")
    user = db.get(User, int(user_id))

    if not user :
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="user not found")

    


    return user